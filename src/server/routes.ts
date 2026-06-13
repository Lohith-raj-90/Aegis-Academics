import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { query } from './db.js';
import { createToken, verifyToken, type SessionUser } from './auth.js';

export interface AuthenticatedRequest extends express.Request {
  user?: SessionUser;
}

function asyncHandler(fn: (req: any, res: any, next: any) => Promise<any>) {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch(next);
  };
}

async function requireAuth(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || !payload.sessionId) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const sessionResult = await query('SELECT id, expires_at FROM sessions WHERE id = $1', [payload.sessionId]);
  const session = sessionResult.rows[0] as { id: string; expires_at: string } | undefined;
  if (!session || new Date(session.expires_at) < new Date()) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  const userResult = await query(
    `SELECT id, email, name, badge, avatar_url as "avatarUrl", readiness_score as "readinessScore", attendance_pct as "attendancePct"
     FROM users WHERE id = $1`,
    [payload.userId]
  );
  const user = userResult.rows[0] as SessionUser | undefined;

  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  user.sessionId = payload.sessionId;
  req.user = user;
  next();
}

export function createAuthRouter() {
  const router = express.Router();

  router.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const existingResult = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingResult.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
        [email, passwordHash, name]
      );

      const userId = result.rows[0].id;
      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await query(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
        [sessionId, userId, expiresAt]
      );

      const token = createToken({ userId, email, sessionId });

      res.status(201).json({
        token,
        user: {
          id: userId,
          email,
          name,
          badge: 'Apprentice Scholar',
          avatarUrl: '',
          readinessScore: 0,
          attendancePct: 0,
        }
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  router.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0] as any;
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await query(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
        [sessionId, user.id, expiresAt]
      );

      const token = createToken({ userId: user.id, email: user.email, sessionId });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          badge: user.badge,
          avatarUrl: user.avatar_url,
          readinessScore: user.readiness_score,
          attendancePct: user.attendance_pct,
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  router.post('/api/auth/logout', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    try {
      if (req.user && req.user.sessionId) {
        await query('DELETE FROM sessions WHERE id = $1', [req.user.sessionId]);
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  router.get('/api/auth/me', asyncHandler(requireAuth), (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        badge: req.user.badge,
        avatarUrl: req.user.avatarUrl,
        readinessScore: req.user.readinessScore,
        attendancePct: req.user.attendancePct,
      }
    });
  });

  router.put('/api/auth/profile', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { name, email } = req.body;
    await query(
      'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name || req.user.name, email || req.user.email, req.user.id]
    );
    res.json({ success: true });
  });

  router.get('/api/tasks', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await query(
      'SELECT id, subject, topic, day, duration, priority, completed FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  });

  router.post('/api/tasks', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { subject, topic, day, duration, priority, completed } = req.body;
    const id = uuidv4();
    await query(
      'INSERT INTO tasks (id, user_id, subject, topic, day, duration, priority, completed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, req.user.id, subject, topic, day, duration, priority, completed ? 1 : 0]
    );
    res.status(201).json({ id, subject, topic, day, duration, priority, completed: !!completed });
  });

  router.put('/api/tasks/:id', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { completed } = req.body;
    await query(
      'UPDATE tasks SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
      [completed ? 1 : 0, req.params.id, req.user.id]
    );
    res.json({ success: true });
  });

  router.delete('/api/tasks/:id', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  });

  router.get('/api/unscheduled', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await query(
      'SELECT id, subject, topic, estimated_hours as "estimatedHours" FROM unscheduled_targets WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  });

  router.post('/api/unscheduled', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { subject, topic, estimatedHours } = req.body;
    const id = uuidv4();
    await query(
      'INSERT INTO unscheduled_targets (id, user_id, subject, topic, estimated_hours) VALUES ($1, $2, $3, $4, $5)',
      [id, req.user.id, subject, topic, estimatedHours]
    );
    res.status(201).json({ id, subject, topic, estimatedHours });
  });

  router.delete('/api/unscheduled/:id', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    await query('DELETE FROM unscheduled_targets WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  });

  router.get('/api/library', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await query(
      'SELECT id, title, category, file_size as "fileSize", synced, abstract FROM library_resources WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  });

  router.put('/api/library/:id/sync', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { synced } = req.body;
    await query(
      'UPDATE library_resources SET synced = $1 WHERE id = $2 AND user_id = $3',
      [synced ? 1 : 0, req.params.id, req.user.id]
    );
    res.json({ success: true });
  });

  router.get('/api/chat/messages', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await query(
      'SELECT id, role, content, timestamp FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(result.rows);
  });

  router.post('/api/chat/messages', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { role, content, timestamp } = req.body;
    const id = uuidv4();
    await query(
      'INSERT INTO chat_messages (id, user_id, role, content, timestamp) VALUES ($1, $2, $3, $4, $5)',
      [id, req.user.id, role, content, timestamp]
    );
    res.status(201).json({ id, role, content, timestamp });
  });

  router.get('/api/attendance', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await query(
      'SELECT id, subject, date, status FROM attendance_ledger WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    res.json(result.rows);
  });

  router.post('/api/attendance', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { subject, date, status } = req.body;
    const id = uuidv4();
    await query(
      'INSERT INTO attendance_ledger (id, user_id, subject, date, status) VALUES ($1, $2, $3, $4, $5)',
      [id, req.user.id, subject, date, status]
    );
    res.status(201).json({ id, subject, date, status });
  });

  router.delete('/api/attendance/:id', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    await query('DELETE FROM attendance_ledger WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  });

  router.put('/api/user/readiness', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { score } = req.body;
    await query(
      'UPDATE users SET readiness_score = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [score, req.user.id]
    );
    res.json({ success: true, score });
  });

  router.put('/api/user/attendance', asyncHandler(requireAuth), async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { percentage } = req.body;
    await query(
      'UPDATE users SET attendance_pct = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [percentage, req.user.id]
    );
    res.json({ success: true, percentage });
  });

  return router;
}

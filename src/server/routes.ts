import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { getDb, type Db } from './db.js';
import { createToken, verifyToken, type SessionUser } from './auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aegis-academics-secret-key-change-in-production';

export interface AuthenticatedRequest extends express.Request {
  user?: SessionUser;
  db?: Db;
}

function requireAuth(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
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

  const db = getDb();
  const session = db.prepare('SELECT id, expires_at FROM sessions WHERE id = ?').get(payload.sessionId) as { id: string; expires_at: string } | undefined;
  if (!session || new Date(session.expires_at) < new Date()) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  const user = db.prepare(`
    SELECT id, email, name, badge, avatar_url as avatarUrl, readiness_score as readinessScore, attendance_pct as attendancePct
    FROM users WHERE id = ?
  `).get(payload.userId) as SessionUser | undefined;

  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  user.sessionId = payload.sessionId;
  req.user = user;
  req.db = db;
  next();
}

export function createAuthRouter() {
  const router = express.Router();

  router.use(cors());
  router.use(express.json());

  router.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const db = getDb();
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = db.prepare(`
        INSERT INTO users (email, password_hash, name)
        VALUES (?, ?, ?)
      `).run(email, passwordHash, name);

      const userId = result.lastInsertRowid as number;
      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      db.prepare(`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (?, ?, ?)
      `).run(sessionId, userId, expiresAt);

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

      const db = getDb();
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      db.prepare(`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (?, ?, ?)
      `).run(sessionId, user.id, expiresAt);

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

  router.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      if (req.user && req.user.sessionId) {
        const db = getDb();
        db.prepare('DELETE FROM sessions WHERE id = ?').run(req.user.sessionId);
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  router.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
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

  router.put('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { name, email } = req.body;
    const db = getDb();
    db.prepare(`
      UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name || req.user.name, email || req.user.email, req.user.id);
    res.json({ success: true });
  });

  router.get('/api/tasks', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    const tasks = db.prepare(`
      SELECT id, subject, topic, day, duration, priority, completed
      FROM tasks WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.id);
    res.json(tasks);
  });

  router.post('/api/tasks', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { subject, topic, day, duration, priority, completed } = req.body;
    const db = getDb();
    const id = uuidv4();
    db.prepare(`
      INSERT INTO tasks (id, user_id, subject, topic, day, duration, priority, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, subject, topic, day, duration, priority, completed ? 1 : 0);
    res.status(201).json({ id, subject, topic, day, duration, priority, completed: !!completed });
  });

  router.put('/api/tasks/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { completed } = req.body;
    const db = getDb();
    db.prepare(`
      UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(completed ? 1 : 0, req.params.id, req.user.id);
    res.json({ success: true });
  });

  router.delete('/api/tasks/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  router.get('/api/unscheduled', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    const targets = db.prepare(`
      SELECT id, subject, topic, estimated_hours as estimatedHours
      FROM unscheduled_targets WHERE user_id = ?
    `).all(req.user.id);
    res.json(targets);
  });

  router.post('/api/unscheduled', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { subject, topic, estimatedHours } = req.body;
    const db = getDb();
    const id = uuidv4();
    db.prepare(`
      INSERT INTO unscheduled_targets (id, user_id, subject, topic, estimated_hours)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, req.user.id, subject, topic, estimatedHours);
    res.status(201).json({ id, subject, topic, estimatedHours });
  });

  router.delete('/api/unscheduled/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    db.prepare('DELETE FROM unscheduled_targets WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  router.get('/api/library', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    const resources = db.prepare(`
      SELECT id, title, category, file_size as fileSize, synced, abstract
      FROM library_resources WHERE user_id = ?
    `).all(req.user.id);
    res.json(resources);
  });

  router.put('/api/library/:id/sync', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { synced } = req.body;
    const db = getDb();
    db.prepare(`
      UPDATE library_resources SET synced = ? WHERE id = ? AND user_id = ?
    `).run(synced ? 1 : 0, req.params.id, req.user.id);
    res.json({ success: true });
  });

  router.get('/api/chat/messages', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    const messages = db.prepare(`
      SELECT id, role, content, timestamp
      FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC
    `).all(req.user.id);
    res.json(messages);
  });

  router.post('/api/chat/messages', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { role, content, timestamp } = req.body;
    const db = getDb();
    const id = uuidv4();
    db.prepare(`
      INSERT INTO chat_messages (id, user_id, role, content, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, req.user.id, role, content, timestamp);
    res.status(201).json({ id, role, content, timestamp });
  });

  router.get('/api/attendance', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    const ledger = db.prepare(`
      SELECT id, subject, date, status
      FROM attendance_ledger WHERE user_id = ? ORDER BY date DESC
    `).all(req.user.id);
    res.json(ledger);
  });

  router.post('/api/attendance', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { subject, date, status } = req.body;
    const db = getDb();
    const id = uuidv4();
    db.prepare(`
      INSERT INTO attendance_ledger (id, user_id, subject, date, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, req.user.id, subject, date, status);
    res.status(201).json({ id, subject, date, status });
  });

  router.delete('/api/attendance/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = getDb();
    db.prepare('DELETE FROM attendance_ledger WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  router.put('/api/user/readiness', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { score } = req.body;
    const db = getDb();
    db.prepare(`
      UPDATE users SET readiness_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(score, req.user.id);
    res.json({ success: true, score });
  });

  router.put('/api/user/attendance', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { percentage } = req.body;
    const db = getDb();
    db.prepare(`
      UPDATE users SET attendance_pct = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(percentage, req.user.id);
    res.json({ success: true, percentage });
  });

  return router;
}

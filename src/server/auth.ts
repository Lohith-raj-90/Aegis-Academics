import jwt from 'jsonwebtoken';
import { query } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aegis-academics-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

export interface JWTPayload {
  userId: number;
  email: string;
  sessionId: string;
}

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  badge: string;
  avatarUrl: string;
  readinessScore: number;
  attendancePct: number;
  sessionId?: string;
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function authenticateRequest(req: any, res: any, next: any): Promise<void> {
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
    'SELECT id, email, name, badge, avatar_url as "avatarUrl", readiness_score as "readinessScore", attendance_pct as "attendancePct" FROM users WHERE id = $1',
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

export async function optionalAuth(req: any, res: any, next: any): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload && payload.sessionId) {
      const sessionResult = await query('SELECT id, expires_at FROM sessions WHERE id = $1', [payload.sessionId]);
      const session = sessionResult.rows[0] as { id: string; expires_at: string } | undefined;
      if (session && new Date(session.expires_at) >= new Date()) {
        const userResult = await query(
          'SELECT id, email, name, badge, avatar_url as "avatarUrl", readiness_score as "readinessScore", attendance_pct as "attendancePct" FROM users WHERE id = $1',
          [payload.userId]
        );
        const user = userResult.rows[0] as SessionUser | undefined;
        if (user) {
          user.sessionId = payload.sessionId;
          req.user = user;
        }
      }
    }
  }
  next();
}

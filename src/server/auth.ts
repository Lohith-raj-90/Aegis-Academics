import jwt from 'jsonwebtoken';
import { getDb, type Db } from './db.js';

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

  const db = getDb();
  const session = db.prepare('SELECT id, expires_at FROM sessions WHERE id = ?').get(payload.sessionId) as { id: string; expires_at: string } | undefined;
  if (!session || new Date(session.expires_at) < new Date()) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  const user = db.prepare('SELECT id, email, name, badge, avatar_url as avatarUrl, readiness_score as readinessScore, attendance_pct as attendancePct FROM users WHERE id = ?').get(payload.userId) as SessionUser | undefined;
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  user.sessionId = payload.sessionId;
  req.user = user;
  req.db = db;
  next();
}

export function optionalAuth(req: any, res: any, next: any): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload && payload.sessionId) {
      const db = getDb();
      const session = db.prepare('SELECT id, expires_at FROM sessions WHERE id = ?').get(payload.sessionId) as { id: string; expires_at: string } | undefined;
      if (session && new Date(session.expires_at) >= new Date()) {
        const user = db.prepare('SELECT id, email, name, badge, avatar_url as avatarUrl, readiness_score as readinessScore, attendance_pct as attendancePct FROM users WHERE id = ?').get(payload.userId) as SessionUser | undefined;
        if (user) {
          user.sessionId = payload.sessionId;
          req.user = user;
          req.db = db;
        }
      }
    }
  }
  next();
}

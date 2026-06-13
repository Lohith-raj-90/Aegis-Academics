import pg from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'aegis.db');

let pgPool: pg.Pool | null = null;
let sqliteDb: Database.Database | null = null;
let usePostgres = false;

function isPostgres(): boolean {
  return !!process.env.DATABASE_URL;
}

async function getPool(): Promise<pg.Pool> {
  if (!pgPool) {
    pgPool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pgPool;
}

function getSqlite(): Database.Database {
  if (!sqliteDb) {
    sqliteDb = new Database(DB_PATH);
    sqliteDb.pragma('journal_mode = WAL');
  }
  return sqliteDb;
}

export async function query(text: string, params?: any[]): Promise<{ rows: any[] }> {
  if (isPostgres()) {
    const pool = await getPool();
    const result = await pool.query(text, params);
    return { rows: result.rows };
  } else {
    const db = getSqlite();
    const pgParams = text.match(/\$\d+/g);
    if (pgParams) {
      const paramCount = pgParams.length;
      const orderedParams = [];
      for (let i = 1; i <= paramCount; i++) {
        orderedParams.push(params?.[i - 1] ?? null);
      }
      const sqliteText = text.replace(/\$\d+/g, '?');
      const stmt = db.prepare(sqliteText);
      if (sqliteText.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...orderedParams);
        return { rows };
      } else {
        const info = stmt.run(...orderedParams);
        return { rows: [{ id: info.lastInsertRowid }] };
      }
    } else {
      const stmt = db.prepare(text);
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        return { rows: stmt.all(...(params || [])) };
      } else {
        const info = stmt.run(...(params || []));
        return { rows: [{ id: info.lastInsertRowid }] };
      }
    }
  }
}

export async function initializeDatabase() {
  if (isPostgres()) {
    usePostgres = true;
    const pool = await getPool();
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          badge TEXT DEFAULT 'Apprentice Scholar',
          avatar_url TEXT DEFAULT '',
          readiness_score INTEGER DEFAULT 0,
          attendance_pct INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          expires_at TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          subject TEXT NOT NULL,
          topic TEXT NOT NULL,
          day TEXT NOT NULL,
          duration TEXT NOT NULL,
          priority TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS unscheduled_targets (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          subject TEXT NOT NULL,
          topic TEXT NOT NULL,
          estimated_hours INTEGER NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS library_resources (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          file_size TEXT NOT NULL,
          synced INTEGER DEFAULT 0,
          abstract TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS attendance_ledger (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          subject TEXT NOT NULL,
          date TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS quiz_sessions (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          questions TEXT NOT NULL,
          current_index INTEGER DEFAULT 0,
          score INTEGER DEFAULT 0,
          completed INTEGER DEFAULT 0,
          user_answers TEXT DEFAULT '{}',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      for (const stmt of [
        'CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_unscheduled_user_id ON unscheduled_targets(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_library_user_id ON library_resources(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_messages(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance_ledger(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_quiz_user_id ON quiz_sessions(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)',
      ]) {
        await client.query(stmt);
      }
      console.log('[DB] PostgreSQL initialized');
    } finally {
      client.release();
    }
  } else {
    usePostgres = false;
    const db = getSqlite();
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        badge TEXT DEFAULT 'Apprentice Scholar',
        avatar_url TEXT DEFAULT '',
        readiness_score INTEGER DEFAULT 0,
        attendance_pct INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        day TEXT NOT NULL,
        duration TEXT NOT NULL,
        priority TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS unscheduled_targets (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        estimated_hours INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS library_resources (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        file_size TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        abstract TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS attendance_ledger (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS quiz_sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        questions TEXT NOT NULL,
        current_index INTEGER DEFAULT 0,
        score INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        user_answers TEXT DEFAULT '{}',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    for (const idx of [
      'CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_unscheduled_user_id ON unscheduled_targets(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_library_user_id ON library_resources(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_messages(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance_ledger(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_quiz_user_id ON quiz_sessions(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)',
    ]) {
      db.exec(idx);
    }
    console.log('[DB] SQLite initialized at', DB_PATH);
  }
}

export type Db = pg.Pool | Database.Database;

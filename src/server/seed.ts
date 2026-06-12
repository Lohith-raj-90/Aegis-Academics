import bcrypt from 'bcrypt';
import { getDb } from './db.js';

const DEFAULT_STUDENTS = [
  {
    email: 'lohith.rc@aegis.edu',
    password: 'student123',
    name: 'Lohith R C',
    badge: 'Sovereign Scholar',
    readinessScore: 86,
    attendancePct: 84,
  },
  {
    email: 'priya.s@aegis.edu',
    password: 'student123',
    name: 'Priya Sharma',
    badge: 'Sage Practitioner',
    readinessScore: 75,
    attendancePct: 88,
  },
  {
    email: 'rahul.k@aegis.edu',
    password: 'student123',
    name: 'Rahul Kumar',
    badge: 'Apprentice Scholar',
    readinessScore: 62,
    attendancePct: 79,
  },
];

const DEFAULT_TASKS = [
  { id: 'task-1', subject: 'Advanced Calculus', topic: 'Taylor Series Expansion & Remainder Term bounds', day: 'Monday', duration: '14:00 - 15:30', priority: 'High', completed: false },
  { id: 'task-2', subject: 'Fluid Dynamics', topic: 'Navier Stokes numerical integrations & pressure fields', day: 'Tuesday', duration: '10:00 - 12:00', priority: 'Medium', completed: true },
  { id: 'task-3', subject: 'Quantum Computing', topic: 'Schrödinger wave solutions & Hilbert space matrices', day: 'Wednesday', duration: '16:00 - 18:00', priority: 'High', completed: false },
];

const DEFAULT_UNSCHEDULED = [
  { id: 'unsched-1', subject: 'Quantum Computing', topic: 'Basic gates (Hadamard, CNOT) & state circuit depth bounds', estimatedHours: 4 },
  { id: 'unsched-2', subject: 'European History Essay', topic: 'Post-war strategic rebuild and economic integration models', estimatedHours: 6 },
];

const LIBRARY_RESOURCES = [
  { id: 'lib-1', title: 'Neural Architecture Concepts', category: 'Computer Science', fileSize: '4.2 MB', synced: true, abstract: 'A rigorous mathematical exploration of synaptic weighting matrices, backpropagation equations, and custom multi-dimensional convolution filters within modern attention interfaces.' },
  { id: 'lib-2', title: 'Quantum Mechanics & Hilbert Space Metrics', category: 'Physics', fileSize: '8.7 MB', synced: false, abstract: 'Eigenvalue decompositions of Hamiltonians in infinite-dimensional vector structures, analyzing quantum uncertainty coefficients and entanglement density thresholds.' },
  { id: 'lib-3', title: 'Advanced Tensor Integration', category: 'Mathematics', fileSize: '12.1 MB', synced: false, abstract: 'Decomposition and transformations of absolute differential metrics on Riemannian manifolds, targeting multi-dimensional curves, geodesics, and curvature tensor bounds.' },
  { id: 'lib-4', title: 'Formal Language Automata Limitations', category: 'Computer Science', fileSize: '3.5 MB', synced: true, abstract: 'An analytical proof concerning non-deterministic Turing deciders and boundary definitions of the Church-Turing thesis regarding computational halting entropy.' },
  { id: 'lib-5', title: 'Thermodynamics & Information Entropy', category: 'Physics', fileSize: '6.8 MB', synced: false, abstract: 'Connecting statistical thermodynamic states with Shannon communication metrics, evaluating systemic heat dissipation boundaries in high-density chips.' },
];

const DEFAULT_LEDGER = [
  { id: 'log-1', subject: 'Advanced Calculus (MA-301)', date: '2026-06-01', status: 'Attended' },
  { id: 'log-2', subject: 'Advanced Calculus (MA-301)', date: '2026-06-02', status: 'Attended' },
  { id: 'log-3', subject: 'Advanced Calculus (MA-301)', date: '2026-06-03', status: 'Absent' },
  { id: 'log-4', subject: 'Advanced Calculus (MA-301)', date: '2026-06-04', status: 'Attended' },
  { id: 'log-5', subject: 'Fluid Dynamics (ME-302)', date: '2026-06-01', status: 'Attended' },
  { id: 'log-6', subject: 'Fluid Dynamics (ME-302)', date: '2026-06-02', status: 'Attended' },
  { id: 'log-7', subject: 'Fluid Dynamics (ME-302)', date: '2026-06-03', status: 'Attended' },
  { id: 'log-8', subject: 'Quantum Computing (CS-303)', date: '2026-05-28', status: 'Attended' },
  { id: 'log-9', subject: 'Quantum Computing (CS-303)', date: '2026-05-29', status: 'Mass Bunk' },
  { id: 'log-10', subject: 'Quantum Computing (CS-303)', date: '2026-06-01', status: 'Attended' },
  { id: 'log-11', subject: 'Quantum Computing (CS-303)', date: '2026-06-02', status: 'Duty Leave' },
  { id: 'log-12', subject: 'Neural Networks (CS-304)', date: '2026-06-01', status: 'Attended' },
  { id: 'log-13', subject: 'Neural Networks (CS-304)', date: '2026-06-02', status: 'Attended' },
  { id: 'log-14', subject: 'Neural Networks (CS-304)', date: '2026-06-03', status: 'Attended' },
  { id: 'log-15', subject: 'Formal Automata (CS-305)', date: '2026-06-01', status: 'Attended' },
  { id: 'log-16', subject: 'Formal Automata (CS-305)', date: '2026-06-02', status: 'Absent' },
  { id: 'log-17', subject: 'Formal Automata (CS-305)', date: '2026-06-03', status: 'Attended' },
];

const DEFAULT_CHAT_MESSAGES = [
  { id: 'greet-1', role: 'assistant', content: 'Academic coordinate synchronization complete, Scholar. Welcome back to the Aegis Command Center.', timestamp: '09:00 UTC' },
  { id: 'greet-2', role: 'assistant', content: 'Active placement diagnostic readiness factor is calibrated at 86/100. Let\'s optimize calculus limit derivations today.', timestamp: '09:01 UTC' },
];

export function seedDatabase(): void {
  const db = getDb();
  const insertMany = db.transaction(() => {
    for (const student of DEFAULT_STUDENTS) {
      const passwordHash = bcrypt.hashSync(student.password, 10);
      const info =       db.prepare(`
        INSERT OR IGNORE INTO users (email, password_hash, name, badge, readiness_score, attendance_pct)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(student.email, passwordHash, student.name, student.badge, student.readinessScore, student.attendancePct);

      const userId = (db.prepare('SELECT id FROM users WHERE email = ?').get(student.email) as { id: number }).id;

      db.prepare(`
        INSERT OR IGNORE INTO tasks (id, user_id, subject, topic, day, duration, priority, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`task-${userId}-1`, userId, 'Advanced Calculus', 'Taylor Series Expansion & Remainder Term bounds', 'Monday', '14:00 - 15:30', 'High', 0);

      db.prepare(`
        INSERT OR IGNORE INTO tasks (id, user_id, subject, topic, day, duration, priority, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`task-${userId}-2`, userId, 'Fluid Dynamics', 'Navier Stokes numerical integrations & pressure fields', 'Tuesday', '10:00 - 12:00', 'Medium', 1);

      db.prepare(`
        INSERT OR IGNORE INTO tasks (id, user_id, subject, topic, day, duration, priority, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`task-${userId}-3`, userId, 'Quantum Computing', 'Schrödinger wave solutions & Hilbert space matrices', 'Wednesday', '16:00 - 18:05', 'High', 0);

      for (const resource of LIBRARY_RESOURCES) {
        db.prepare(`
          INSERT OR IGNORE INTO library_resources (id, user_id, title, category, file_size, synced, abstract)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(`${resource.id}-${userId}`, userId, resource.title, resource.category, resource.fileSize, resource.synced ? 1 : 0, resource.abstract);
      }

      for (const entry of DEFAULT_LEDGER) {
        db.prepare(`
          INSERT OR IGNORE INTO attendance_ledger (id, user_id, subject, date, status)
          VALUES (?, ?, ?, ?, ?)
        `).run(`${entry.id}-${userId}`, userId, entry.subject, entry.date, entry.status);
      }

      for (const msg of DEFAULT_CHAT_MESSAGES) {
        db.prepare(`
          INSERT OR IGNORE INTO chat_messages (id, user_id, role, content, timestamp)
          VALUES (?, ?, ?, ?, ?)
        `).run(`${msg.id}-${userId}`, userId, msg.role, msg.content, msg.timestamp);
      }
    }
    console.log(`Seeded ${DEFAULT_STUDENTS.length} users with default data.`);
  });

  insertMany();
}



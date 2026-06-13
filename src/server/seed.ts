import bcrypt from 'bcrypt';
import { query } from './db.js';

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

const LIBRARY_RESOURCES = [
  { title: 'Neural Architecture Concepts', category: 'Computer Science', fileSize: '4.2 MB', synced: true, abstract: 'A rigorous mathematical exploration of synaptic weighting matrices, backpropagation equations, and custom multi-dimensional convolution filters within modern attention interfaces.' },
  { title: 'Quantum Mechanics & Hilbert Space Metrics', category: 'Physics', fileSize: '8.7 MB', synced: false, abstract: 'Eigenvalue decompositions of Hamiltonians in infinite-dimensional vector structures, analyzing quantum uncertainty coefficients and entanglement density thresholds.' },
  { title: 'Advanced Tensor Integration', category: 'Mathematics', fileSize: '12.1 MB', synced: false, abstract: 'Decomposition and transformations of absolute differential metrics on Riemannian manifolds, targeting multi-dimensional curves, geodesics, and curvature tensor bounds.' },
  { title: 'Formal Language Automata Limitations', category: 'Computer Science', fileSize: '3.5 MB', synced: true, abstract: 'An analytical proof concerning non-deterministic Turing deciders and boundary definitions of the Church-Turing thesis regarding computational halting entropy.' },
  { title: 'Thermodynamics & Information Entropy', category: 'Physics', fileSize: '6.8 MB', synced: false, abstract: 'Connecting statistical thermodynamic states with Shannon communication metrics, evaluating systemic heat dissipation boundaries in high-density chips.' },
];

const DEFAULT_LEDGER = [
  { subject: 'Advanced Calculus (MA-301)', date: '2026-06-01', status: 'Attended' },
  { subject: 'Advanced Calculus (MA-301)', date: '2026-06-02', status: 'Attended' },
  { subject: 'Advanced Calculus (MA-301)', date: '2026-06-03', status: 'Absent' },
  { subject: 'Advanced Calculus (MA-301)', date: '2026-06-04', status: 'Attended' },
  { subject: 'Fluid Dynamics (ME-302)', date: '2026-06-01', status: 'Attended' },
  { subject: 'Fluid Dynamics (ME-302)', date: '2026-06-02', status: 'Attended' },
  { subject: 'Fluid Dynamics (ME-302)', date: '2026-06-03', status: 'Attended' },
  { subject: 'Quantum Computing (CS-303)', date: '2026-05-28', status: 'Attended' },
  { subject: 'Quantum Computing (CS-303)', date: '2026-05-29', status: 'Mass Bunk' },
  { subject: 'Quantum Computing (CS-303)', date: '2026-06-01', status: 'Attended' },
  { subject: 'Quantum Computing (CS-303)', date: '2026-06-02', status: 'Duty Leave' },
  { subject: 'Neural Networks (CS-304)', date: '2026-06-01', status: 'Attended' },
  { subject: 'Neural Networks (CS-304)', date: '2026-06-02', status: 'Attended' },
  { subject: 'Neural Networks (CS-304)', date: '2026-06-03', status: 'Attended' },
  { subject: 'Formal Automata (CS-305)', date: '2026-06-01', status: 'Attended' },
  { subject: 'Formal Automata (CS-305)', date: '2026-06-02', status: 'Absent' },
  { subject: 'Formal Automata (CS-305)', date: '2026-06-03', status: 'Attended' },
];

const DEFAULT_CHAT_MESSAGES = [
  { role: 'assistant', content: 'Academic coordinate synchronization complete, Scholar. Welcome back to the Aegis Command Center.', timestamp: '09:00 UTC' },
  { role: 'assistant', content: "Active placement diagnostic readiness factor is calibrated at 86/100. Let's optimize calculus limit derivations today.", timestamp: '09:01 UTC' },
];

export async function seedDatabase(): Promise<void> {
  for (const student of DEFAULT_STUDENTS) {
    const existing = await query('SELECT id FROM users WHERE email = $1', [student.email]);
    if (existing.rows.length > 0) continue;

    const passwordHash = await bcrypt.hash(student.password, 10);
    const userResult = await query(
      'INSERT INTO users (email, password_hash, name, badge, readiness_score, attendance_pct) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [student.email, passwordHash, student.name, student.badge, student.readinessScore, student.attendancePct]
    );
    const userId = userResult.rows[0].id;

    await query(
      'INSERT INTO tasks (id, user_id, subject, topic, day, duration, priority, completed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [`task-${userId}-1`, userId, 'Advanced Calculus', 'Taylor Series Expansion & Remainder Term bounds', 'Monday', '14:00 - 15:30', 'High', 0]
    );
    await query(
      'INSERT INTO tasks (id, user_id, subject, topic, day, duration, priority, completed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [`task-${userId}-2`, userId, 'Fluid Dynamics', 'Navier Stokes numerical integrations & pressure fields', 'Tuesday', '10:00 - 12:00', 'Medium', 1]
    );
    await query(
      'INSERT INTO tasks (id, user_id, subject, topic, day, duration, priority, completed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [`task-${userId}-3`, userId, 'Quantum Computing', 'Schrödinger wave solutions & Hilbert space matrices', 'Wednesday', '16:00 - 18:05', 'High', 0]
    );

    for (const resource of LIBRARY_RESOURCES) {
      await query(
        'INSERT INTO library_resources (id, user_id, title, category, file_size, synced, abstract) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [`${userId}-${resource.title.slice(0, 10)}`, userId, resource.title, resource.category, resource.fileSize, resource.synced ? 1 : 0, resource.abstract]
      );
    }

    for (const entry of DEFAULT_LEDGER) {
      await query(
        'INSERT INTO attendance_ledger (id, user_id, subject, date, status) VALUES ($1, $2, $3, $4, $5)',
        [`${userId}-${entry.date}-${entry.subject.slice(0, 5)}`, userId, entry.subject, entry.date, entry.status]
      );
    }

    for (const msg of DEFAULT_CHAT_MESSAGES) {
      await query(
        'INSERT INTO chat_messages (id, user_id, role, content, timestamp) VALUES ($1, $2, $3, $4, $5)',
        [`${userId}-${msg.timestamp}`, userId, msg.role, msg.content, msg.timestamp]
      );
    }
  }
  console.log(`Seeded ${DEFAULT_STUDENTS.length} users with default data.`);
}

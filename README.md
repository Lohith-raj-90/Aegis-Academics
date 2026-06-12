# Aegis Academics

**Aegis app** — a full-stack academic command center built by **Lohith R C**, Computer Science & Engineering student at Kalpataru Institute of Technology (KIT), Tiptur.

Aegis Academics brings attendance forecasting, exam planning, syllabus library, placement quizzes, interactive 3D math visualizers, and an AI study companion into one unified student workspace — designed around real VTU curriculum needs.

---

## Features

| Module | What it does |
|--------|----------------|
| **Dashboard** | Semester progress, readiness scores, and subject overview |
| **Attendance** | VTU attendance simulator with eligibility forecasting |
| **Planner** | Scheduled tasks and unscheduled study goals |
| **Resources** | Syllabus vault with sync tracking |
| **Quiz Suite** | Placement-style diagnostics with readiness scoring |
| **AI Chat** | Aegis Core AI assistant with offline fallback |
| **3D Sandbox** | Interactive quantum core renderer (WebGL-style math projections) |

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Motion
- **Backend:** Express + Vite (dev middleware)
- **AI:** Server-side LLM integration via `@google/genai` (optional — works offline without API key)
- **Persistence:** Versioned `localStorage` with schema self-healing

---

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root (copy from `.env.example`):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   > The app runs without an API key — AI chat falls back to built-in academic heuristics. Add a key only if you want live LLM responses.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open **http://localhost:3000** in your browser. The tab will show **Aegis app**.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
aegis-academics/
├── server.ts          # Express API + Vite dev server
├── src/
│   ├── App.tsx        # Main app shell, routing, state
│   ├── components/    # Dashboard, Chat, Quiz, Planner, etc.
│   ├── data.ts        # Default syllabus & task data
│   └── types.ts       # TypeScript schemas
└── index.html         # Entry point (tab title: Aegis app)
```

---

## Developer

**Lohith R C**  
CSE · Kalpataru Institute of Technology, Tiptur  
Email: lohithraj9090@gmail.com  
GitHub: github.com/lohith-raj-90

---

© 2026 Aegis Academics — Developed by Lohith R C

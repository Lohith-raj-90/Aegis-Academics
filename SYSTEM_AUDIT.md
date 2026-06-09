# Aegis Academics Command Center
## Unified Full-Stack Architectural Blueprint & System Specifications

---

### 1. Architectural Overview & Structural Flow

Aegis Academics is a highly responsive, custom-crafted full-stack application engineered to optimize college academic trajectories. Structured specifically to address Visvesvaraya Technological University (VTU) curriculum models, it integrates rigorous performance tracking, live syllabus checklists, academic simulators, and a robust conversational AI interface.

#### System Interaction Topology

```
                  ┌──────────────────────────────────────────────┐
                  │          STUDENT USER VIEW INTERFACE         │
                  └──────────────────────┬───────────────────────┘
                                         │
                   (Navigation Action & State Dispatchers)
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                ▼                                ▼
┌────────────────┐               ┌────────────────┐               ┌────────────────┐
│ 3D CANVAS LOOP │               │  SECURE CACHE  │               │ CHAT AI CORE   │
│ QuantumCore3D  │               │useLocalStorageS│               │  Express Proxy │
│ Math Manifolds │               │ Version-Locked │               │ Heuristic Sync │
└───────┬────────┘               └───────┬────────┘               └───────┬────────┘
        │                                │                                │
 (Passive Sleep                        (Schema                       (Dual-Path Offline
 Throttling Stage)                      Healing)                     Fallback Routing)
        │                                │                                │
        ▼                                ▼                                ▼
[STANDBY STATE]                  [RESILIENT DESERIAL]            [LOCAL EXPERT BUFFER]
```

#### Directory Architecture
- `/server.ts`: Node.js multi-stage Express proxy server. Manages secure CORS validations, lazy-loaded Gemini API clients to avoid startup crashes, and developer bundle configurations.
- `/src/App.tsx`: Global core controller acting as the central engine for authentication paths, tab navigation, active contextual highlighting state trackers, and primary theme hooks.
- `/src/types.ts`: Strictly defined schema templates supporting static typing constraints across tabs (`TabType`), exam objectives (`ExamTask`), textbooks (`LibraryResource`), and message payloads (`ChatMessage`).
- `/src/data.ts`: Holds initial static datasets, textbook listings, syllabus nodes, and VTU reference margins.
- `/src/components/`:
  - `DashboardContainer.tsx`: Pure presentational layout transition wrapper that harnesses specialized spring physics animations via `motion/react` to prevent harsh visual snapping.
  - `QuantumCore3D.tsx`: Highly optimized, pure math 3D projection rendering engine implementing spherical rotation matrices, orthographic projection layers, and inertially decaying drag vectors.
  - `DashboardView.tsx`: Integrated home command center displaying active subjects matrix, attendance simulators, focus duration metrics, and recent activity logs.
  - `AttendanceView.tsx`: Precision attendance logbook providing micro-incremental toggles to calculate clearance scores against VTU minimum requirements.
  - `LibraryView.tsx`: Resource catalog implementing quick-search filters and file syncing trackers.
  - `ChatView.tsx`: Conversational AI console linking the user directly to active proxy endpoints.
  - `QuizView.tsx`: Flashcard diagnostic system rendering active score aggregation models.
  - `PlannerView.tsx`: Interactive chronologic academic scheduler organizing upcoming semesters.

---

### 2. Logic, Hydration, & Functional Refactor

#### A. Data Overhaul: `useLocalStorageSecure`
To eliminate brittleness during application schema updates, the hydration engine implements a strict schema version marker (`version: 2`) wrapped around stored state values:

```typescript
interface SchemaVersionEnvelope<T> {
  version: number;
  data: T;
}
```

- **Validation Checks**: Retrieves parameters, parsing values within defensive try-catch containers. If a version mismatch is detected, it triggers a **Structural Self-Healing Routine**.
- **Self-Healing Mechanics**: If the old value and the incoming initial shape are both functional JSON objects, the secure synchronizer executes an elegant key merge, safeguarding previous custom user settings while incorporating default values required by the new release:
  ```typescript
  if (typeof initialValue === "object" && initialValue !== null) {
    return { ...initialValue, ...parsedEnvelope.data };// Merged securely
  }
  ```

#### B. Performance Optimization: `useKineticThrottler`
The standard rendering loops in web browsers can saturate system CPU limits. `QuantumCore3D` corrects this using a custom energy-aware performance hook that tracks physics momentum:

$$\omega = \sqrt{\omega_x^2 + \omega_y^2}$$

- **Idle Decay Threshold**: If the drag vectors undergo inertial friction decay and fall below $\omega < 0.005$ over an $8000\text{ms}$ inactive timer window, the loop auto-activates `.PASSIVE_SLEEP` stage flags.
- **Sleep Rendering Halt**: Halts rendering cycles entirely, drawing a static, battery-efficient dashboard standby plate:
  `● MODULE_STANDBY // ω < 0.005`.
- **Eager Wake-Up**: Attaches listeners to cursor movement, mouse clicks, key events, and dynamic dashboard metrics, restarting the high-frequency physics cycles instantly without a single frame of lag.

#### C. Interaction Overhaul: Shared Context Interlocking
The AI Assistant acts as a unified hub of academic context rather than an isolated conversational module:
- **Natural Language Parsing**: As the user converses on the `ChatView`, an internal parsing engine continuously evaluates incoming prompts and assistant replies for key terms:
  - `"calculus"`, `"coordinate"`, `"limit"`, `"green"`, `"integral"` $\rightarrow$ **Calculus Grouping**
  - `"quantum"`, `"qubit"`, `"circuits"`, `"superposition"`, `"physics"`, `"gate"` $\rightarrow$ **Quantum Grouping**
  - `"np"`, `"automata"`, `"turing"`, `"halt"`, `"languages"`, `"reduc"` $\rightarrow$ **Automata Grouping**
  - `"attendance"`, `"vtu"`, `"clearance"`, `"hours"` $\rightarrow$ **Attendance Grouping**
- **Syllabus and Library Highlighting**:
  - The calculated keyword persists inside the state variable `activeHighlightKeyword`.
  - When matches occur, the corresponding textbook modules in the **Library** or curriculum subject nodes in the **Dashboard** visually animate, pulsing with amber gold, flashing high-contrast indicators, and displaying custom `"LINKED"` tags that guide the student directly to relevant resources.
  - It remains fully clearing, enabling students to flush active linkages with standard close button handlers.

---

### 3. UX/UI & Responsive Calibration

#### Visual Framework Specifications

| Design Attribute | Token Class / Value | System Purpose |
|---|---|---|
| **Base Theme** | Neutral coal (`bg-neutral-950`) / Slate tones | Reduces eye strain and establishes a sleek, high-contrast dark visual identity. |
| **Accent Primary** | Amber Gold (`text-amber-400`, `border-amber-450`) | Represents standard, healthy operational states. |
| **Accent Secondary**| Indigo (`text-indigo-400`, `border-indigo-505`) | Activates during Deep Focus mode configurations. |
| **Fonts (Headers)** | Space Grotesk / Outfit | Elegant display headings with professional geometry. |
| **Fonts (System)**  | JetBrains Mono / Fira Code | Monospace indicators for raw calculations and status. |
| **Paddings** | Desktop: `p-8` / Embedded containers: `p-6` | Balances white space for high-density layouts. |

#### Fluid Transition Dynamics
To eradicate abrupt snapping during layout shifts, **DashboardContainer** intercepts active tabs and distraction mode switches via standard `popLayout` transitions.

1. **Standard Mode (`ANALYTICS_COMMAND`)**:
   - Spans cards into optimal nested distributions (Syllabus/Curriculum matrix at `lg:col-span-8`, Live Activity Streams at `lg:col-span-4`).
   - Keeps utility and forecasting widgets visible to support student analysis.
2. **Distraction-Free Mode (`DEEP_FOCUS`)**:
   - Dims active ambient back-glows to lower brightness (`opacity-15 blur-lg`).
   - Dynamically collapses the VTU Forecaster and Activity panels.
   - Smoothly expands the core interactive cards, transitioning from an asymmetrical layout to a unified symmetry grid (`lg:col-span-12`), maximizing focus area.

---

### 4. Technical Execution Roadmap

```
┌────────────────────────────────────────────────────────┐
│ STEP 1: Core Secure Engine Integration                  │
│ Validate secure cached versioning pipelines            │
├────────────────────────────────────────────────────────┤
│ STEP 2: Passive Energy Canvas Upgrades                  │
│ Apply kinetic sleep algorithms to conserve CPU limits  │
├────────────────────────────────────────────────────────┤
│ STEP 3: Contextual Interlinking Engine                 │
│ Interleave chat streams with curriculum grids          │
├────────────────────────────────────────────────────────┤
│ STEP 4: Kinetic Motion Spring Interlayers               │
│ Standardize Dashboard transition layouts               │
└────────────────────────────────────────────────────────┘
```

#### Metrics & Validation Criteria
- **Rendering Overhead**: Under active idling conditions sustained over $8\text{ seconds}$, canvas render cycles automatically drop to zero $(0)$ calculated repaint steps per frame, conserving battery and system memory.
- **State Robustness**: Upgrading the application cache dynamically handles partial or deprecated states safely without throwing runtime crashes or layout disruptions.
- **Visual Smoothness**: Transition layouts scale fluidly using spring mechanics instead of rendering discrete CSS style snapping frames.

import { LibraryResource, ExamTask, UnscheduledTarget, QuizQuestion } from "./types";

export const DEFAULT_TASKS: ExamTask[] = [
  {
    id: "task-1",
    subject: "Advanced Calculus",
    topic: "Taylor Series Expansion & Remainder Term bounds",
    day: "Monday",
    duration: "14:00 - 15:30",
    priority: "High",
    completed: false
  },
  {
    id: "task-2",
    subject: "Fluid Dynamics",
    topic: "Navier Stokes numerical integrations & pressure fields",
    day: "Tuesday",
    duration: "10:00 - 12:00",
    priority: "Medium",
    completed: true
  },
  {
    id: "task-3",
    subject: "Quantum Computing",
    topic: "Schrödinger wave solutions & Hilbert space matrices",
    day: "Wednesday",
    duration: "16:00 - 18:00",
    priority: "High",
    completed: false
  }
];

export const DEFAULT_UNSCHEDULED: UnscheduledTarget[] = [
  {
    id: "unsched-1",
    subject: "Quantum Computing",
    topic: "Basic gates (Hadamard, CNOT) & state circuit depth bounds",
    estimatedHours: 4
  },
  {
    id: "unsched-2",
    subject: "European History Essay",
    topic: "Post-war strategic rebuild and economic integration models",
    estimatedHours: 6
  }
];

export const LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: "lib-1",
    title: "Neural Architecture Concepts",
    category: "Computer Science",
    fileSize: "4.2 MB",
    synced: true,
    abstract: "A rigorous mathematical exploration of synaptic weighting matrices, backpropagation equations, and custom multi-dimensional convolution filters within modern attention interfaces."
  },
  {
    id: "lib-2",
    title: "Quantum Mechanics & Hilbert Space Metrics",
    category: "Physics",
    fileSize: "8.7 MB",
    synced: false,
    abstract: "Eigenvalue decompositions of Hamiltonians in infinite-dimensional vector structures, analyzing quantum uncertainty coefficients and entanglement density thresholds."
  },
  {
    id: "lib-3",
    title: "Advanced Tensor Integration",
    category: "Mathematics",
    fileSize: "12.1 MB",
    synced: false,
    abstract: "Decomposition and transformations of absolute differential metrics on Riemannian manifolds, targeting multi-dimensional curves, geodesics, and curvature tensor bounds."
  },
  {
    id: "lib-4",
    title: "Formal Language Automata Limitations",
    category: "Computer Science",
    fileSize: "3.5 MB",
    synced: true,
    abstract: "An analytical proof concerning non-deterministic Turing deciders and boundary definitions of the Church-Turing thesis regarding computational halting entropy."
  },
  {
    id: "lib-5",
    title: "Thermodynamics & Information Entropy",
    category: "Physics",
    fileSize: "6.8 MB",
    synced: false,
    abstract: "Connecting statistical thermodynamic states with Shannon communication metrics, evaluating systemic heat dissipation boundaries in high-density chips."
  }
];

export const CALCULUS_QUESTIONS: QuizQuestion[] = [
  {
    id: "calc-1",
    question: "Using Taylor's theorem, what is the third-order expansion of f(x) = ln(x) about a = 1?",
    options: [
      "(x-1) - (x-1)²/2 + (x-1)³/3",
      "(x-1) + (x-1)²/2 + (x-1)³/3",
      "(x-1) - (x-1)²/2 - (x-1)³/6",
      "1 - (x-1) + (x-1)²/2 - (x-1)³/3"
    ],
    correctAnswer: "(x-1) - (x-1)²/2 + (x-1)³/3",
    explanation: "For ln(x) around a = 1: f(1)=0, f'(1)=1, f''(1)=-1, f'''(1)=2. Dividers are n!, yielding coefficients 1, -1/2, and 2/6 = 1/3."
  },
  {
    id: "calc-2",
    question: "Which of the following describes the convergence behavior of the series Σ (n=1 to ∞) ((-1)^n / n^0.5)?",
    options: [
      "Conditionally convergent",
      "Absolutely convergent",
      "Divergent",
      "Directly oscillating with infinite bound"
    ],
    correctAnswer: "Conditionally convergent",
    explanation: "By the Alternating Series Test, it converges. However, the absolute value series is a p-series with p=0.5, which is divergent."
  },
  {
    id: "calc-3",
    question: "Calculate the value of the line integral ∫ (y dx + x dy) over any smooth curve from (0,0) to (2,3).",
    options: [
      "6",
      "5",
      "0",
      "Cannot be determined without the specific curve equation"
    ],
    correctAnswer: "6",
    explanation: "The input vector field F = (y, x) is conservative because ∂P/∂y = ∂Q/∂x = 1. Its potential function is φ(x,y) = xy. Evaluating at the boundaries yields φ(2,3) - φ(0,0) = 6."
  },
  {
    id: "calc-4",
    question: "What is the limit as x goes to 0 of (cos(x) - 1) / x²?",
    options: [
      "-1/2",
      "0",
      "1/2",
      "Does not exist"
    ],
    correctAnswer: "-1/2",
    explanation: "Applying L'Hôpital's Rule twice: lim -sin(x)/(2x) = lim -cos(x)/2 = -1/2."
  }
];

export const FLASHCARDS: QuizQuestion[] = [
  {
    id: "fc-1",
    question: "What is the physical meaning of the divergence theorem (Gauss's Theorem)?",
    correctAnswer: "It equates the outward flux of a vector field through a closed surface to the volume integral of the divergence inside that boundary.",
    explanation: "This mathematically represents that net localized source expansion rates within a region equal the total flow leaking through its boundaries."
  },
  {
    id: "fc-2",
    question: "Define Hilbert Space briefly.",
    correctAnswer: "A complete inner product space, meaning real or complex dimensions are preserved and Cauchy sequences converge to elements inside the space.",
    explanation: "Ideal for quantum state representation, allowing length and angular projection metrics in infinite dimensions."
  },
  {
    id: "fc-3",
    question: "Explain Navier-Stokes Equations' primary challenge.",
    correctAnswer: "Proving smooth, globally defined solutions exist in 3D without encountering physical singular values (infinite densities or velocities).",
    explanation: "It is one of the Millennium Prize Problems because general three-dimensional analytic solutions remain unproven."
  }
];

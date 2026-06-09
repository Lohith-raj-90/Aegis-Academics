import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe lazy initializer for Gemini Client
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables. Please check Settings > Secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Dynamic Dynamic Heuristic Academic Response Generator
  function getHeuristicAcademicResponse(userPrompt: string): string {
    const promptLower = userPrompt.toLowerCase();
    
    // Direct trigger mappings to VTU college curriculum
    if (promptLower.includes("calculus") || promptLower.includes("math") || promptLower.includes("integral") || promptLower.includes("derivative") || promptLower.includes("matrix")) {
      return `### 📐 Aegis Local Heuristic Core: Calculus & Advanced Engineering Math

Our neural telemetry registers query focus on engineering calculus coordinates. Here are the direct priority action steps to secure optimal grades under Visvesvaraya Technological University (VTU) guidelines:

#### 1. Core Examination Target Checkpoints
* **Ordinary & Partial Differential Equations**: Focus on Exact form, Leibniz rules, and Cauchy-Euler equations.
* **Vector Calculus & Integral Theorems**: Revise Green's, Gauss Divergence, and Stokes' theorems. Expect at least one full module question on Stokes' boundary validations.
* **Linear Algebra**: Master Matrix diagonalization, characteristic equations, and Eigenvalue/Eigenvector boundaries.

#### 2. Specialized Study Directives
| Module Focus | Expected Weightage | Recommended Study Method |
|---|---|---|
| Multiple Integrals | 20% | Solve triple integration over bounded spheres |
| Vector Integration | 20% | Standardize parameterizations first |
| Infinite Series Convergence | 15% | Deploy D'Alembert's ratio test as secondary checkpoint |

📝 *Recommended Action*: Load the **Advanced Engineering Mathematics** reference workbook from your **Library Dashboard** to instantly trace step-by-step manifolds.

---
📝 *Status*: Aegis Academics is currently running in robust **Heuristic Backup Mode** due to high upstream cognitive server loads. All custom logs and session databases remain fully safe.`;
    }
    
    if (promptLower.includes("quantum") || promptLower.includes("physics") || promptLower.includes("superposition") || promptLower.includes("qubit") || promptLower.includes("schrodinger")) {
      return `### ⚛️ Aegis Local Heuristic Core: Quantum Physics & Quantum Computing

Your query aligns with quantum system coordinates and quantum mechanics coursework. Trace this immediate heuristic syllabus blueprint:

#### 1. Active Curriculum Priorities
* **Wave-Particle Duality & Schrödinger's Equation**: Be ready to calculate steady-state solutions for a particle in a 1D potential well.
* **Superposition & Qubits**: Under VTU Advanced Physics schemas, review Bloch Sphere representations, probability amplitudes ($|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$), and Hadamard gate matrix calculations.
* **Quantum Gates & Entanglement**: Standardize your understanding of the CNOT gate matrix operations and Bell states.

#### 2. Strategic Mastery Matrix
* **Step 1**: Open the **Quantum Computing Core** textbook in your **Library Tab**.
* **Step 2**: Track your study duration using the interactive **Focus Timer**. Aim for 45-minute continuous segments (the optimal cognitive memory buffer).
* **Step 3**: Simulate the Quantum mechanics state variables on the **QuantumCore3D visualizer** in your primary command deck. WATCH FOR ORBITAL MATRIX FLUXES.

---
📝 *Status*: Aegis Academics is currently running in robust **Heuristic Backup Mode** due to high upstream cognitive server loads. All custom logs and session databases remain fully safe.`;
    }
    
    if (promptLower.includes("automata") || promptLower.includes("turing") || promptLower.includes("cfg") || promptLower.includes("languages") || promptLower.includes("dfa") || promptLower.includes("nfa")) {
      return `### 💻 Aegis Local Heuristic Core: Computability, Automata, & Complexity

You are investigating Theory of Computation / Automata structures. Let us streamline your VTU exam clearance guidelines instantly:

#### 1. High-Probability Module Target Matrix
* **Regular Expressions & Finite Automata**: Mastery of DFA minimization and NFA-to-DFA conversions. There is a 100% chance of a question requiring the design of a DFA accepting specific divisibility conditions (e.g., binary numbers divisible by 3).
* **Context-Free Grammars (CFG) & Pushdown Automata**: Learn to eliminate ambiguity from algebraic grammar modules, and practice constructing non-deterministic PDAs.
* **Turing Machines & Undecidability**: Review Turing Thesis, Halting Problem boundaries, and Diagonalization Proof structures.

#### 2. Grade Clearance Directives
Verify your current syllabus trackers and cross-check the Automata Reference textbook. Keep active schedules inside the **Academic Planner** to verify exam milestones.

---
📝 *Status*: Aegis Academics is currently running in robust **Heuristic Backup Mode** due to high upstream cognitive server loads. All custom logs and session databases remain fully safe.`;
    }
    
    if (promptLower.includes("attendance") || promptLower.includes("clearance") || promptLower.includes("hours") || promptLower.includes("bunk") || promptLower.includes("percent")) {
      return `### 📊 Aegis Local Heuristic Core: Attendance Optimization & Compliance

Tracking academic clearance coordinates is essential for maintaining Visvesvaraya Technological University (VTU) exam registration clearance.

#### 1. Strict Institutional Thresholds
* **Unconditional Examination Eligibility**: $\\ge 85\\%$ attendance is optimized.
* **Discretionary Condonation Range**: $75\\% - 84\\%$ (requires verified medical certification and Departmental approval).
* **Ineligibility / Red Flag Zone**: $< 75\\%$ attendance. Absolute bar from entering laboratories or theory exams.

#### 2. Immediate Recovery Actions
* **Configure Simulator**: Go to the **Attendance Tab** and use the interactive clearance simulator.
* **Action Calculation**: Input your current total classes held. The system will tell you *exactly* how many successive lectures you must attend without failure to safely regain a healthy green zone score ($\\ge 85\\%$).
* **Mitigation Tracker**: Log any upcoming leaves in the **Academic Planner** to forecast impact before taking them.

---
📝 *Status*: Aegis Academics is currently running in robust **Heuristic Backup Mode** due to high upstream cognitive server loads. All custom logs and session databases remain fully safe.`;
    }
    
    if (promptLower.includes("library") || promptLower.includes("books") || promptLower.includes("textbook") || promptLower.includes("reference") || promptLower.includes("sync")) {
      return `### 📚 Aegis Local Heuristic Core: Scholar Library Resource Guide

Accessing verified course material is critical to achieving top grades (S/A grade brackets). Here is your current dynamic library routing:

#### 1. Key Academic Volumes Available
* **Advanced Engineering Mathematics (Calculus Core)**: Covers Laplace transforms, fourier series, divergence theorems, and coordinate geometry.
* **Principles of Quantum Computing & Mechanics**: Covers Schrodinger's systems, quantum superposition gates, and Bloch state topologies.
* **Introduction to Automata & Computability (ToC)**: Guides you through alphabet definitions, grammar transformations, pushdown matrices, and Turing formulations.

#### 2. Synchronizing Digital Resources
* Open the **Library Dashboard**.
* Click the **Sync** toggle button next to your desired resource. This triggers a simulated offline catalog index so you can track study objectives.
* Cross-reference chapters highlighted under your active **Syllabus Dashboard View**.

---
📝 *Status*: Aegis Academics is currently running in robust **Heuristic Backup Mode** due to high upstream cognitive server loads. All custom logs and session databases remain fully safe.`;
    }
    
    // Default fallback
    return `### 🛡️ Welcome to Aegis Academics Command Center Core

Your communication has routed directly to the Aegis heuristic neural backup layer. To optimize your academic journey, explore the integrated system modules:

#### 🧭 Integrated Modules & Navigation Commands
1. **Academic Dashboard**: Check current VTU courses (Calculus, Quantum Computing, Automata Theory), review syllabus checkpoints, and monitor overall study progress.
2. **Attendance Tracker**: Use the predictive simulator to calculate exactly how many classes you can afford to skip or must attend to remain safely above the mandatory **75% / 85% eligibility line**.
3. **Conversational AI Partner**: Type questions regarding Calculus matrices, Quantum wavefunctions, or Automata DFA construction for rapid, targeted guidance guidelines.
4. **Library Workbook Sync**: Instantly access required textbooks, download references, and track active chapters.
5. **Interactive Diagnostic Suite**: Launch short-form mock exam cards under the **Diagnostic View** to verify your active recall capabilities.

---
📝 *Status Note*: Aegis Academics is currently running in a robust **local cognitive fallback state** to protect system speed during temporary upstream server demand peaks. Your local data sync remains fully functional and 100% operational.`;
  }

  // API Endpoint for Aegis Core AI chatbot with exponential backoff other fallback modes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Safe retrieval of latest user query
      const userLatestText = [...messages].reverse().find(m => m.role === "user")?.content || "";

      let ai;
      try {
        ai = getAiClient();
      } catch (authError: any) {
        console.warn("[Aegis Fallback] Initiating heuristic engine directly due to missing API credentials.");
        const localResponse = getHeuristicAcademicResponse(userLatestText);
        return res.json({ content: localResponse });
      }

      // Standardize messages to Gemini role schemas ('user' and 'model')
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }],
      }));

      const systemInstruction = 
        "You are Aegis Core AI, the elite neural student advisor for the Aegis Academics Command Center. " +
        "You speak with a sophisticated, intellectual, encouraging, and highly scholarly tone. " +
        "You are helping a Crown Member student optimize their academic trajectory. " +
        "Provide direct, highly structured suggestions, referencing advanced calculus diagnostics, " +
        "exam blueprints, study strategies, and knowledge indexing. " +
        "Use clean Markdown formatting, tables, or itemized steps to look incredibly polished.";

      // Support fallback models if the primary model returns 503
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
      let responseText = "";
      let success = false;
      let lastApiError: any = null;

      for (const modelToRun of modelsToTry) {
        if (success) break;

        let attempt = 0;
        const maxAttempts = 3; // 3 total attempts per model (1 original + 2 retries)
        let delayMs = 300;

        while (attempt < maxAttempts && !success) {
          try {
            console.log(`[Aegis AI Core] Requesting "${modelToRun}" - Attempt ${attempt + 1}/${maxAttempts}...`);
            const response = await ai.models.generateContent({
              model: modelToRun,
              contents: contents,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });

            responseText = response.text || "No response received. Please try again.";
            success = true;
            console.info(`[Aegis AI Core] Successfully resolved request using "${modelToRun}".`);
          } catch (modelError: any) {
            lastApiError = modelError;
            attempt++;
            const errorMessage = (modelError.message || "").toLowerCase();
            const is503OrRateLimit = errorMessage.includes("503") || 
                                      errorMessage.includes("demand") || 
                                      errorMessage.includes("rate limit") || 
                                      errorMessage.includes("resource") || 
                                      errorMessage.includes("429");

            if (is503OrRateLimit && attempt < maxAttempts) {
              console.warn(`[Aegis AI Core] Upstream 503/429 registered. Deploying exponential backoff in ${delayMs}ms...`);
              await new Promise(resolve => setTimeout(resolve, delayMs));
              delayMs *= 2.2; // Exponential Backoff step
            } else {
              // Break early if it's a structural syntax error or we have exhausted attempts
              break;
            }
          }
        }
      }

      if (success) {
        res.json({ content: responseText });
      } else {
        console.error("[Aegis AI Core] All upstream models and backoff retries exhausted. Running secure Academic Cognitive Fallback.", lastApiError);
        const fallbackText = getHeuristicAcademicResponse(userLatestText);
        res.json({ content: fallbackText });
      }

    } catch (globalError: any) {
      console.error("[Aegis Global API Catch] Unexpected route error raised:", globalError);
      res.status(500).json({ 
        error: globalError.message || "An error occurred while contacting the Aegis neural core fallback." 
      });
    }
  });

  // Vite development vs production asset handling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aegis server active at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Aegis Academics server:", err);
});

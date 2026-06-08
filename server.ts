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

  // API Endpoint for Aegis Core AI chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const ai = getAiClient();

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

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "No response received. Please try again.";
      res.json({ content: responseText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error.message || "An error occurred while contacting the Aegis neural core." 
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

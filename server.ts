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

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoints
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, type, channel } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Generate content tailored to the requested channel/type
      let systemInstruction = "You are an expert Moroccan digital content creator, financial analyst, and website developer. Respond in French (since the user requested in French), maintaining a professional and highly engaging Moroccan business/finance style.";
      if (channel) {
        systemInstruction += ` Your focus is specifically on the channel "${channel}".`;
      }
      
      if (type === "video") {
        systemInstruction += " Generate a compelling video concept, hook, structured outline, and a short script draft (intro/outro). Focus on Moroccan economics, finance, corporate reporting, or analysis.";
      } else if (type === "article") {
        systemInstruction += " Generate an engaging LinkedIn/Facebook/Instagram article outline, title suggestions, and a polished introductory paragraph.";
      } else if (type === "web") {
        systemInstruction += " You are an expert web developer specializing in React, TypeScript, and Tailwind CSS. Provide a structured plan to improve the user's dashboard or personal website, along with clean, production-ready code blocks.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during text generation." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

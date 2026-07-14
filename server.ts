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

  // Outlook OAuth URL generator
  app.get("/api/auth/outlook/url", (req, res) => {
    const client_id = process.env.OUTLOOK_CLIENT_ID || "MOCK_OUTLOOK_CLIENT_ID";
    const origin = req.query.origin || "http://localhost:3000";
    const redirect_uri = `${origin}/api/auth/outlook/callback`;

    const params = new URLSearchParams({
      client_id: client_id,
      response_type: "code",
      redirect_uri: redirect_uri,
      response_mode: "query",
      scope: "offline_access Calendars.ReadWrite",
      state: origin as string, // pass origin to callback to construct dynamic redirect_uri
    });

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
    res.json({ url: authUrl });
  });

  // Outlook OAuth Callback
  app.get("/api/auth/outlook/callback", async (req, res) => {
    const { code, state } = req.query;
    if (!code) {
      return res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OUTLOOK_AUTH_FAILURE', error: 'Code d\\\'autorisation manquant.' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    }

    const origin = (state as string) || "http://localhost:3000";
    const redirect_uri = `${origin}/api/auth/outlook/callback`;
    const client_id = process.env.OUTLOOK_CLIENT_ID || "MOCK_OUTLOOK_CLIENT_ID";
    const client_secret = process.env.OUTLOOK_CLIENT_SECRET || "";

    try {
      // Exchange code for Microsoft Graph tokens
      const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id,
          scope: "offline_access Calendars.ReadWrite",
          code: code as string,
          redirect_uri,
          grant_type: "authorization_code",
          client_secret,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        throw new Error(`Échec de l\\\'échange du jeton Microsoft : ${tokenResponse.status} - ${errText}`);
      }

      const data = await tokenResponse.json();

      res.send(`
        <html>
          <head>
            <title>Connexion Outlook Réussie</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb; color: #111827; }
              .card { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 400px; }
              .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #2563eb; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 1rem auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="card">
              <h2 style="color: #10b981; margin-top: 0;">✔ Connexion Réussie !</h2>
              <p>Votre compte Outlook a été connecté avec succès à l\\\'application.</p>
              <div class="spinner"></div>
              <p style="font-size: 0.85rem; color: #6b7280;">Cette fenêtre se fermera automatiquement...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OUTLOOK_AUTH_SUCCESS',
                  accessToken: '${data.access_token}',
                  refreshToken: '${data.refresh_token || ""}',
                  expiresIn: ${data.expires_in || 3600}
                }, '*');
                setTimeout(() => window.close(), 1000);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error("Outlook OAuth callback error:", err);
      const cleanMsg = err.message.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, " ");
      res.send(`
        <html>
          <head>
            <title>Erreur de Connexion Outlook</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb; color: #111827; }
              .card { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 400px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2 style="color: #ef4444; margin-top: 0;">❌ Échec de la connexion</h2>
              <p>Une erreur est survenue lors de la tentative de connexion à Outlook :</p>
              <p style="background: #f3f4f6; padding: 0.75rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; text-align: left; overflow-x: auto; color: #ef4444;">${cleanMsg}</p>
              <p style="font-size: 0.85rem; color: #6b7280;">Vous pouvez fermer cette fenêtre et réessayer.</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OUTLOOK_AUTH_FAILURE',
                  error: '${cleanMsg}'
                }, '*');
              }
            </script>
          </body>
        </html>
      `);
    }
  });

  // Outlook OAuth Refresh Token
  app.post("/api/auth/outlook/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required." });
    }

    const client_id = process.env.OUTLOOK_CLIENT_ID || "MOCK_OUTLOOK_CLIENT_ID";
    const client_secret = process.env.OUTLOOK_CLIENT_SECRET || "";

    try {
      const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id,
          scope: "offline_access Calendars.ReadWrite",
          refresh_token: refreshToken,
          grant_type: "refresh_token",
          client_secret,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        throw new Error(`Microsoft token refresh failed: ${tokenResponse.status} - ${errText}`);
      }

      const data = await tokenResponse.json();
      res.json({
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresIn: data.expires_in,
      });
    } catch (err: any) {
      console.error("Outlook Token Refresh Error:", err);
      res.status(500).json({ error: err.message || "Failed to refresh Outlook token" });
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

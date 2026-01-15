import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 
app.use(express.static(__dirname));

// 🔐 API key lives ONLY here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                  }
                },
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 250
          }
        })
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


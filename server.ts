import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY not found. Server will run in cosmic fallback simulation mode.");
}

app.use(express.json());

// API route for AI-powered Cosmos interactions
app.post("/api/cosmos/ai", async (req, res) => {
  const { mode, message, context } = req.body;

  if (!mode) {
    return res.status(400).json({ error: "Mission parameter 'mode' is required." });
  }

  // Fallback database if AI is offline or key is missing
  const getFallbackResponse = (mode: string, message: string) => {
    const query = (message || "").toLowerCase();
    if (mode === "generate_exoplanet") {
      // Procedurally generate a fallback planet
      const hash = query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 123;
      const seedName = message ? message.charAt(0).toUpperCase() + message.slice(1).replace(/[^a-zA-Z0-9]/g, "") : "Novis Prime";
      const atmospheres = ["Supercritical CO2", "Neon-Nitrogen Ice", "Silicate Vapor", "High Helium", "Liquid Methane Clouds", "Sulfuric acid"];
      const colors = ["#ff3366", "#33ffcc", "#ffaa00", "#aa00ff", "#00ffff", "#ff00ff", "#55ff55"];
      
      return {
        name: `${seedName}-${100 + (hash % 900)}`,
        classification: hash % 2 === 0 ? "Super-Earth" : "Gas Giant Core",
        mass: `${(1.2 + (hash % 10)).toFixed(1)} Earth Masses`,
        temperature: `${-150 + (hash % 400)}°C`,
        atmosphere: atmospheres[hash % atmospheres.length],
        colors: [colors[hash % colors.length], colors[(hash + 2) % colors.length]],
        distance: `${(15 + (hash % 150)).toFixed(1)} Light Years`,
        orbitalSpeed: 0.01 + (hash % 5) * 0.005,
        habitable: hash % 3 === 0,
        description: `Procedurally mapped Sector ${hash % 1000}. A captivating world exhibiting a strong electromagnetic field, with layers of ${atmospheres[hash % atmospheres.length].toLowerCase()} suspended above a basaltic crust.`
      };
    }

    if (mode === "tutor") {
      if (query.includes("black hole")) {
        return "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, has enough energy to escape. This occurs when a massive star collapses at the end of its life cycle. At the center lies a gravitational singularity, bordered by an event horizon.";
      }
      if (query.includes("nebula")) {
        return "Nebulas are giant clouds of dust and gas in space. Some nebulae are regions where new stars are beginning to form (stellar nurseries), such as the Orion Nebula, while others are created by the gas thrown out by the explosion of a dying star, like a supernova.";
      }
      return "Fascinating query! In stellar mechanics, celestial systems operate on gravitational equilibriums. Stars fuse hydrogen into helium in their cores, creating outward radiation pressure that balances the inward pull of gravity.";
    }

    if (mode === "tour") {
      return "Greetings, space traveler. I am Commander Orion, your AI Tour Guide. Today, we will embark on an orbital traversal. Let us initialize warp drive to explore the Ring nebula or the stellar nurseries of the Eagle Nebula.";
    }

    return "COSMOS OS online. Telemetry is active. Ready to assist with celestial navigation, physics queries, and planetary scans.";
  };

  try {
    if (!ai) {
      // No API key - return simulated cosmic data
      const simulatedData = getFallbackResponse(mode, message);
      return res.json({ text: typeof simulatedData === "string" ? simulatedData : null, data: typeof simulatedData === "object" ? simulatedData : null, simulated: true });
    }

    // Handle exoplanet generation using structured JSON
    if (mode === "generate_exoplanet") {
      const prompt = `Generate a realistic scientifically-inspired fictional exoplanet based on the user request: "${message}". Make it sound highly authentic, detailed, and visually interesting. Use the specified JSON schema.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an astrophysics procedural planet generator for COSMOS OS. Generate extremely detailed, scientific, and visually striking exoplanets.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the planet" },
              classification: { type: Type.STRING, description: "Type of planet, e.g. Gas Giant, Super-Earth, Chthonian planet, Carbon planet" },
              mass: { type: Type.STRING, description: "Planet mass relative to Earth or Jupiter" },
              temperature: { type: Type.STRING, description: "Average surface temperature in Celsius" },
              atmosphere: { type: Type.STRING, description: "Primary atmospheric gases and features" },
              colors: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of 2 hex color strings representing the planet's visual aesthetic, e.g. ['#ff4400', '#220033']"
              },
              distance: { type: Type.STRING, description: "Distance from Earth, e.g., '42.5 Light Years'" },
              orbitalSpeed: { type: Type.NUMBER, description: "Speed of orbit in the rendering engine, between 0.005 (slow) and 0.04 (fast)" },
              habitable: { type: Type.BOOLEAN, description: "Whether life is theoretically possible under any extremophile conditions" },
              description: { type: Type.STRING, description: "A detailed 2-3 sentence scientific and visual summary of the planet" }
            },
            required: ["name", "classification", "mass", "temperature", "atmosphere", "colors", "distance", "orbitalSpeed", "habitable", "description"]
          }
        }
      });

      const parsedData = JSON.parse(response.text?.trim() || "{}");
      return res.json({ data: parsedData });
    }

    // Handle tutoring mode
    if (mode === "tutor") {
      let systemInstruction = "You are the COSMOS OS AI Astronomy Tutor. You explain complex astrophysics, cosmic phenomena, and celestial bodies in a clear, inspiring, and scientifically accurate manner. Use concise and elegant markdown.";
      if (context?.educationLevel) {
        systemInstruction += ` Tailor your explanation to the level of a: ${context.educationLevel}.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message || "Explain the concept of quantum fluctuations in the early universe.",
        config: { systemInstruction }
      });

      return res.json({ text: response.text });
    }

    // Handle tour guide mode
    if (mode === "tour") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a narrative, highly cinematic guided tour through space. Target destination or theme: "${message || "Milky Way Galaxy Center"}". Keep the description thrilling, vivid, and highly visual, as if we are traveling on a starship. Format with markdown.`,
        config: {
          systemInstruction: "You are the COSMOS OS AI Tour Guide starship commander. Guide the user in first-person through incredible sectors of space, giving visual and environmental sensory descriptions of what they see outside the cockpit window."
        }
      });

      return res.json({ text: response.text });
    }

    // General AI Assistant Chat Mode
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message || "Identify active celestial signals.",
      config: {
        systemInstruction: "You are COSMOS OS, a futuristic superintelligent quantum computer operating system aboard an exploration starship. You are highly analytical, poetic yet scientific, polite, and responsive. Use clean formatting, compact markdown, and futuristic technical terminology."
      }
    });

    return res.json({ text: response.text });

  } catch (error: any) {
    console.error("Gemini server API error:", error);
    // Return simulated data as a robust fallback so the app never fails for the user
    const fallback = getFallbackResponse(mode, message);
    return res.json({ 
      text: typeof fallback === "string" ? fallback : null, 
      data: typeof fallback === "object" ? fallback : null,
      simulated: true, 
      error: error.message || "Celestial uplink disrupted. Engaged secure local backup database." 
    });
  }
});

// Configure Vite middleware or production static files
async function initServer() {
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
    console.log(`COSMOS OS online. Navigating on port ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Cosmic engine start failure:", err);
});

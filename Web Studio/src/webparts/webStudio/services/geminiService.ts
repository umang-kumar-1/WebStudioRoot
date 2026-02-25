import { GoogleGenAI } from "@google/genai";
import { ThemeConfig } from "../types";
import { DEFAULT_THEME } from "../store";

const THEME_GENERATION_PROMPT = `
You are an expert UI/UX designer and CSS Architect.
I will give you a "mood" or "style description" for a corporate website.
You must return a JSON object containing CSS variable values that match this mood.
Map your design choices to the following keys ONLY:
${Object.keys(DEFAULT_THEME).join(', ')}

Ensure high accessibility contrast.
Return ONLY the JSON object. No markdown, no explanations.
`;

const API_KEYS = [
  "AIzaSyAzgbylmy2zG6vqSnPY4TH0DqN8C_-sZz0",
  "AIzaSyCVW7nlxqfUk2G5j3D3ZmbjjYdZRqJiY8Q",
  "AIzaSyA4uuV8PIGjmoHv4oC_jR6KAdlfuqgv6Hg",
  "AIzaSyA_HdLPgTHT_7Y0-uQRra9MdVGue82Jph4",
  "AIzaSyA-KJtbDDTDS9y9YQo3Id4pff9E27zkdxI",
  "AIzaSyCta3X1TD-1S3p22z5NDMDHuCmFubcA0_g",
  "AIzaSyD2yqDsPCm94AkkDC2F7MVyx2x-ESmBfpY",
  "AIzaSyA1gEhHtgQOyPFVC_MPvuVEGYWrHFgWvbM",
  "AIzaSyB20IqDVRI02wVOAVvQmJVso9eMgKQQxW8",
  "AIzaSyAY6VOjk7xFqvp-QhpIO2aGP3gb1yuvsyQ",
  "AIzaSyB0L_3I5EvYjE0x4PUWjlJTtNZg3_-Zubw"
];

const getRandomKey = () => API_KEYS[Math.floor(Math.random() * API_KEYS.length)];

const getAIClient = () => {
  const key = getRandomKey();
  if (!key) {
    console.error("No API Keys available");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateThemeFromPrompt = async (prompt: string): Promise<ThemeConfig | null> => {
  const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-001', 'gemini-pro', 'gemini-1.0-pro'];

  const ai = getAIClient();
  if (!ai) return null;

  for (const model of modelsToTry) {
    try {
      // We want a strict JSON response
      const response = await ai.models.generateContent({
        model: model,
        contents: [
          { role: 'user', parts: [{ text: THEME_GENERATION_PROMPT + `\n\nMOOD: "${prompt}"` }] }
        ],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text;
      if (!text) continue;

      const themeData = JSON.parse(text);

      // Basic validation to ensure we merge with defaults for safety
      return {
        ...DEFAULT_THEME,
        ...themeData
      };
    } catch (error: any) {
      console.warn(`Gemini Theme Gen Model ${model} failed:`, error.message || error);
      if (model === modelsToTry[modelsToTry.length - 1]) {
        console.error("All Gemini Theme Gen models failed.");
        return null;
      }
    }
  }
  return null;
};

export const translateText = async (text: string, targetLang: string): Promise<string | null> => {
  if (!text || !text.trim()) return null;

  const prompt = `Translate the following text into ${targetLang}. Return ONLY the translated text, no markdown, no quotes, no explanations.\n\nText: "${text}"`;

  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEYS[i] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (!response.text) throw new Error("Empty AI response");

      return response.text.trim();

    } catch (error: any) {
      const errorMsg = error?.message || "";

      // 🔁 Switch API key only on quota/token issues
      if (
        errorMsg.includes("429") ||
        errorMsg.includes("RESOURCE_EXHAUSTED") ||
        errorMsg.includes("quota") ||
        errorMsg.includes("rate")
      ) {
        console.warn(`Gemini quota exhausted for key ${i + 1}, switching key...`);
        continue;
      }

      // ❌ Any other error → stop immediately
      console.error("Gemini translateText error:", errorMsg);
      return null;
    }
  }

  console.error("All Gemini API keys exhausted for translation.");
  return null;
};
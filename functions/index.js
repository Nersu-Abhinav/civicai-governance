import { onRequest } from "firebase-functions/v2/https";
import { defineSecret, defineString } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { GoogleGenAI } from "@google/genai";

initializeApp();
const db = getFirestore();
const geminiApiKey = defineSecret("GEMINI_API_KEY");
const geminiModel = defineString("GEMINI_MODEL", { default: "gemini-3.8-flash" });

const SYSTEM_INSTRUCTION = `You are CivicAI Governance, an AI-assisted public-service triage system for India.
Analyze citizen reports conservatively. Never invent facts, legal claims, addresses, or emergency instructions.
Return ONLY valid JSON matching the requested schema.
Use plain language. Prefer a human-review recommendation whenever confidence is low.
Priority must be based on understandable signals: urgency, essential-service impact, public-safety risk, recurrence, and affected population.
You are providing decision support, not making an autonomous government decision.`;

const schema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    category: { type: "string" },
    department: { type: "string" },
    priority: { type: "string", enum: ["High", "Medium", "Low"] },
    language: { type: "string" },
    confidence: { type: "number" },
    reason: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    humanReview: { type: "boolean" },
    signals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          value: { type: "string" }
        },
        required: ["name", "value"]
      }
    }
  },
  required: ["summary", "category", "department", "priority", "language", "confidence", "reason", "tags", "humanReview", "signals"]
};

function json(res, status, payload) {
  res.status(status).set("Cache-Control", "no-store").json(payload);
}

function cleanText(value, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function clampConfidence(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

export const analyzeIssue = onRequest(
  {
    region: "asia-south1",
    timeoutSeconds: 60,
    memory: "512MiB",
    secrets: [geminiApiKey]
  },
  async (req, res) => {
    if (req.method !== "POST") return json(res, 405, { error: "POST required" });

    try {
      const body = req.body ?? {};
      const message = cleanText(body.message);
      const location = cleanText(body.location, 300) || "Location not specified";
      const requestedLanguage = cleanText(body.language, 80) || "Auto-detect";
      const imageData = cleanText(body.imageData, 5_000_000);
      const imageMimeType = cleanText(body.imageMimeType, 100) || "image/jpeg";

      if (!message) return json(res, 400, { error: "A citizen report message is required." });

      const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
      const inputParts = [
        {
          text: `Citizen report:\n${message}\n\nLocation supplied by citizen:\n${location}\n\nRequested language:\n${requestedLanguage}\n\nAnalyze this civic-service report for category, department, priority, language, explainable signals, and safe human-review handling.`
        }
      ];

      if (imageData && imageData.length < 4_500_000 && imageMimeType.startsWith("image/")) {
        inputParts.push({ inlineData: { mimeType: imageMimeType, data: imageData } });
      }

      const response = await ai.models.generateContent({
        model: geminiModel.value(),
        contents: [{ role: "user", parts: inputParts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.2,
          maxOutputTokens: 900
        }
      });

      const parsed = JSON.parse(response.text);
      const result = {
        ...parsed,
        confidence: clampConfidence(parsed.confidence),
        humanReview: Boolean(parsed.humanReview) || clampConfidence(parsed.confidence) < 0.75,
        createdAt: new Date().toISOString()
      };

      const reportRef = await db.collection("civicReports").add({
        ...result,
        message,
        location,
        requestedLanguage,
        hasImage: Boolean(imageData),
        createdAt: FieldValue.serverTimestamp(),
        source: "citizen-prototype"
      });

      return json(res, 200, { id: reportRef.id, ...result });
    } catch (error) {
      console.error("CivicAI analysis failed", error);
      return json(res, 500, {
        error: "AI analysis failed. Please retry or use the prototype fallback.",
        code: "AI_ANALYSIS_FAILED"
      });
    }
  }
);

export const health = onRequest({ region: "asia-south1" }, (_req, res) => {
  json(res, 200, { service: "civicai-governance", status: "ok", time: new Date().toISOString() });
});

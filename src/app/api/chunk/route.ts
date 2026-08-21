import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateSmartChunks } from "@/lib/semanticChunker";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, parentLabel, currentMode, depth = 0, apiKey: clientApiKey } = body;

    if (!topic && !parentLabel) {
      return NextResponse.json({ error: "Topic or parentLabel is required" }, { status: 400 });
    }

    const effectiveApiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (effectiveApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
        const prompt = `You are the master cognitive guide of "Chunker-AI", an app that guides users step-by-step to mastery through chunks of information and next steps.

Task:
For the subject "${topic || parentLabel}" (parent context: "${parentLabel || topic}", depth: ${depth}), generate 4 to 6 alternating learning chunks:
1. THOUGHT BRANCHES (branchKind: "thought"): Deep conceptual breakthroughs, first principles, mental models, key insights, analogies.
2. ACTION BRANCHES (branchKind: "action"): Concrete 15-to-30 minute actionable micro-missions, hands-on drills, real-world exercises, code/experiment tasks.

REQUIREMENTS:
- Provide rich, non-generic, highly practical learning guidance.
- For each action branch, give 3 step-by-step micro-tasks in 'actionableSteps'.
- For each thought branch, provide a profound 'keyInsight' and 'whyItMatters'.
- Return strict JSON array with this exact schema:

[
  {
    "label": "Concise title (e.g. 'Loss Functions & Gradient' for thought, or 'Action: Train Baseline Model in Colab' for action)",
    "description": "One concise sentence describing this chunk",
    "branchKind": "thought" or "action",
    "icon": "A single relevant emoji (e.g. 💡, ⚡, 🧪, 🧠, 📐, 🎯, 🚀)",
    "whyItMatters": "Why this specific knowledge or action is critical for mastery",
    "keyInsight": "One high-leverage mental model or formula",
    "actionableSteps": [
      "Step 1: Concrete micro-task",
      "Step 2: Specific drill/exercise",
      "Step 3: Verification/synthesis check"
    ],
    "realWorldExample": "How top practitioners use this in practice",
    "challengeQuestion": "A quick quiz question to verify understanding",
    "challengeAnswer": "The precise answer to the question",
    "timeEstimate": "e.g. 25 min",
    "prerequisites": ["Prereq 1"],
    "xpReward": 150
  }
]
Output ONLY raw JSON array. No markdown formatting.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = response.text || "";
        const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({ chunks: parsed, source: "gemini" });
        }
      } catch (geminiErr) {
        console.warn("Gemini API generation fallback:", geminiErr);
      }
    }

    // Fallback to rich semantic mastery engine
    const chunks = generateSmartChunks(topic || parentLabel, parentLabel || topic, depth, currentMode);
    return NextResponse.json({ chunks, source: "semantic-engine" });
  } catch (err: unknown) {
    console.error("Chunking error:", err);
    return NextResponse.json({ error: "Failed to generate chunks" }, { status: 500 });
  }
}

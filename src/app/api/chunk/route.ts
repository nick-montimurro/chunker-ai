import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateSmartChunks } from "@/lib/semanticChunker";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, parentLabel, currentMode = "skill-tree", depth = 0, apiKey: clientApiKey } = body;

    if (!topic && !parentLabel) {
      return NextResponse.json({ error: "Topic or parentLabel is required" }, { status: 400 });
    }

    const effectiveApiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (effectiveApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: effectiveApiKey });

        let modeInstructions = "";
        if (currentMode === "skill-tree") {
          modeInstructions = `MAPPING PHILOSOPHY: RPG Tiered Skill Tree (Skill Builder).
- Structure branches as: Tier ${depth + 1} Conceptual Lore/Axioms (Thought) vs Timed Speed Drills & Capstone Missions (Action).
- Tone: Adventurous, mastery-oriented, deliberate practice, compounding XP.`;
        } else if (currentMode === "arch") {
          modeInstructions = `MAPPING PHILOSOPHY: Systems Architecture & Component Dataflow Pipeline.
- Structure branches as: Service Contracts/Ingress Protocols (Thought) vs Background Queues, Caching, Sharding Drills (Action).
- Tone: Systems engineer, throughput, latency, high-availability, fault-tolerance.`;
        } else {
          modeInstructions = `MAPPING PHILOSOPHY: Detective Investigation Board (Evidence Web & Red Strings).
- Structure branches as: Evidence Dossiers/Primary Fact Audits (Thought) vs Forensic Hypothesis Tests & Case Closure Reports (Action).
- Tone: Investigative, skeptical, falsification, fact-versus-theory, forensic proof.`;
        }

        const prompt = `You are the master cognitive architect of "Chunker-AI".

Target Subject: "${topic || parentLabel}"
Parent Context: "${parentLabel || topic}"
Depth Level: ${depth}
Mode: ${currentMode}

${modeInstructions}

TASK:
Generate 3 to 5 alternating learning chunks:
1. THOUGHT BRANCHES (branchKind: "thought"): Deep conceptual breakthroughs, mental models, governing rules.
2. ACTION BRANCHES (branchKind: "action"): Highly specific micro-missions broken up into manageable step-by-step tasks in dropdown-ready groups.

REQUIREMENTS:
- For every Action Branch, provide 1 to 2 "microTaskGroups", each with 2 specific "steps" containing a concrete command/snippet, verification outcome, and estimated time.
- Return ONLY a strict JSON array with this exact schema:

[
  {
    "label": "Concise node title",
    "description": "One sentence summary",
    "branchKind": "thought" or "action",
    "icon": "A single relevant emoji (e.g. 💡, ⚡, 🧪, 🛡️, 📜, 🏆)",
    "whyItMatters": "Why this specific knowledge or action is critical for mastery",
    "keyInsight": "One high-leverage mental model or rule",
    "actionableSteps": [
      "Quick overview step 1",
      "Quick overview step 2"
    ],
    "microTaskGroups": [
      {
        "id": "tg-1",
        "title": "Task 1: [Specific Task Name]",
        "overview": "What this task accomplishes",
        "steps": [
          {
            "id": "s-1a",
            "title": "1a. [Micro Step Title]",
            "detail": "Precise execution instruction",
            "commandSnippet": "e.g. npm run test / curl / python code",
            "verificationOutcome": "How to verify this step succeeded",
            "timeEstimate": "e.g. 8 min"
          }
        ]
      }
    ],
    "realWorldExample": "How top experts or companies implement this",
    "challengeQuestion": "Active recall quiz question",
    "challengeAnswer": "Accurate answer",
    "timeEstimate": "e.g. 25 min",
    "prerequisites": ["Prerequisite name"],
    "xpReward": 150
  }
]

Output ONLY raw JSON array.`;

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

    // Fallback to mode-specific semantic mastery engine
    const chunks = generateSmartChunks(topic || parentLabel, parentLabel || topic, depth, currentMode);
    return NextResponse.json({ chunks, source: "semantic-engine" });
  } catch (err: unknown) {
    console.error("Chunking error:", err);
    return NextResponse.json({ error: "Failed to generate chunks" }, { status: 500 });
  }
}

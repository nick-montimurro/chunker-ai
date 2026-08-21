"use client";

import { create } from "zustand";
import { type Node, type Edge } from "@xyflow/react";

export type AppMode = "skill-tree" | "arch" | "detective";
export type AppPhase = "landing" | "canvas";

export interface NodeData extends Record<string, unknown> {
  label: string;
  description: string;
  type: "root" | "concept" | "branch" | "leaf";
  isGenerating?: boolean;
  depth?: number;
  icon?: string;
}

interface PendingAddition {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

interface ChunkerStore {
  // App phase
  phase: AppPhase;
  masterTopic: string;

  // Stats
  nodeCount: number;
  edgeCount: number;
  xp: number;

  // Pending additions
  pendingAddition: PendingAddition | null;

  // UI
  currentMode: AppMode;
  selectedNode: Node<NodeData> | null;
  isPro: boolean;
  showPricing: boolean;
  generatingIds: Set<string>;

  // Actions
  startMastery: (topic: string) => void;
  resetToLanding: () => void;
  setNodeCount: (n: number) => void;
  setEdgeCount: (n: number) => void;
  addXp: (amount: number) => void;
  clearPendingAddition: () => void;
  setMode: (mode: AppMode) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  setIsPro: (v: boolean) => void;
  setShowPricing: (v: boolean) => void;
  generateBranch: (
    parentId: string,
    parentPos: { x: number; y: number },
    parentDepth: number,
    parentLabel: string
  ) => Promise<void>;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── Content banks ────────────────────────────────────────────────────────────
const BRANCH_BANKS: Record<AppMode, { labels: string[]; descs: string[]; icons: string[] }> = {
  "skill-tree": {
    icons: ["📖", "🧠", "⚡", "🎯", "🔑", "🏆", "💡", "🧩", "🌱", "🚀"],
    labels: [
      "Core Fundamentals", "Mental Models", "Practice Methods", "Expert Habits",
      "Key Frameworks", "Common Pitfalls", "Quick Wins", "Deep Dives",
      "Real Applications", "Mastery Milestones",
    ],
    descs: [
      "Build an unshakeable foundation — start here",
      "Think like an expert from day one",
      "Deliberate practice beats passive reading",
      "Daily habits compound into mastery",
    ],
  },
  arch: {
    icons: ["⚙️", "🔗", "📊", "🛡️", "🔄", "📡", "🗄️", "🏗️", "📈", "🔧"],
    labels: [
      "API Layer", "Data Flow", "Scalability", "Security Model",
      "Observability", "Message Queue", "Storage Layer", "CI/CD Pipeline",
      "Performance", "Fault Tolerance",
    ],
    descs: [
      "Entry point for all external requests",
      "How data moves through the system",
      "Design for 10x growth from day one",
      "Zero-trust security at every boundary",
    ],
  },
  detective: {
    icons: ["🔍", "📎", "🗒️", "🔭", "🧪", "📷", "🗂️", "🔐", "📜", "🕵️"],
    labels: [
      "Key Evidence", "Primary Suspect", "Timeline", "Witness Account",
      "Forensic Data", "Crime Scene", "Motive Analysis", "Alibi Check",
      "Hidden Connections", "The Breakthrough",
    ],
    descs: [
      "Crucial evidence — handle with care",
      "Follow the trail, trust the data",
      "Every detail matters in sequence",
      "Cross-reference all sources",
    ],
  },
};

// ── Generate initial satellite nodes from topic ──────────────────────────────
function generateInitialNodes(topic: string, mode: AppMode): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const bank = BRANCH_BANKS[mode];
  const cx = 480;
  const cy = 360;
  const radius = 220;

  // Pick 5 contextual subtopics
  const subtopics = generateSubtopics(topic, mode);

  const rootNode: Node<NodeData> = {
    id: "root",
    type: "skill",
    position: { x: cx, y: cy },
    data: {
      label: topic,
      description: `Your mastery journey for "${topic}" starts here. Double-click any node to dive deeper.`,
      type: "root",
      depth: 0,
      icon: "✦",
    },
  };

  const satelliteNodes: Node<NodeData>[] = subtopics.map((sub, i) => {
    const angle = (i / subtopics.length) * 2 * Math.PI - Math.PI / 2;
    return {
      id: `init-${i}`,
      type: "skill",
      position: {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      },
      data: {
        label: sub.label,
        description: sub.desc,
        type: "concept",
        depth: 1,
        icon: bank.icons[i % bank.icons.length],
      },
    };
  });

  const edges: Edge[] = satelliteNodes.map((n) => ({
    id: `e-root-${n.id}`,
    source: "root",
    target: n.id,
    animated: true,
    type: "smoothstep",
  }));

  return { nodes: [rootNode, ...satelliteNodes], edges };
}

function generateSubtopics(topic: string, mode: AppMode): { label: string; desc: string }[] {
  const bank = BRANCH_BANKS[mode];
  // Deterministic shuffle seeded on topic
  const seed = topic.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const shuffled = [...bank.labels].sort((a, b) => {
    const ai = (seed * (bank.labels.indexOf(a) + 1)) % 17;
    const bi = (seed * (bank.labels.indexOf(b) + 1)) % 17;
    return ai - bi;
  });
  return shuffled.slice(0, 5).map((label, i) => ({
    label,
    desc: bank.descs[i % bank.descs.length],
  }));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Store ────────────────────────────────────────────────────────────────────
export const useStore = create<ChunkerStore>((set, get) => ({
  phase: "landing",
  masterTopic: "",
  nodeCount: 0,
  edgeCount: 0,
  xp: 0,
  pendingAddition: null,
  currentMode: "skill-tree",
  selectedNode: null,
  isPro: false,
  showPricing: false,
  generatingIds: new Set(),

  startMastery: (topic: string) => {
    set({ phase: "canvas", masterTopic: topic.trim() });
  },

  resetToLanding: () => {
    set({
      phase: "landing",
      masterTopic: "",
      nodeCount: 0,
      edgeCount: 0,
      pendingAddition: null,
      generatingIds: new Set(),
      selectedNode: null,
    });
  },

  setNodeCount: (n) => set({ nodeCount: n }),
  setEdgeCount: (n) => set({ edgeCount: n }),
  addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
  clearPendingAddition: () => set({ pendingAddition: null }),
  setMode: (mode) => set({ currentMode: mode }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setIsPro: (v) => set({ isPro: v }),
  setShowPricing: (v) => set({ showPricing: v }),

  generateBranch: async (parentId, parentPos, parentDepth, parentLabel) => {
    set((s) => ({
      generatingIds: new Set([...s.generatingIds, parentId]),
    }));

    await sleep(900 + Math.random() * 400);

    const { currentMode } = get();
    const bank = BRANCH_BANKS[currentMode];
    const ts = Date.now();
    const SPREAD = 210;

    const newNodes: Node<NodeData>[] = [-1, 0, 1].map((offset, i) => ({
      id: `${parentId}-br-${ts}-${i}`,
      type: "skill",
      position: {
        x: parentPos.x + offset * SPREAD,
        y: parentPos.y + 190,
      },
      data: {
        label: pickRandom(bank.labels),
        description: pickRandom(bank.descs),
        type: "branch" as const,
        isGenerating: false,
        depth: parentDepth + 1,
        icon: pickRandom(bank.icons),
      },
    }));

    const newEdges: Edge[] = newNodes.map((n) => ({
      id: `e-${parentId}-${n.id}`,
      source: parentId,
      target: n.id,
      animated: true,
      type: "smoothstep",
    }));

    set((s) => {
      const ids = new Set(s.generatingIds);
      ids.delete(parentId);
      return {
        generatingIds: ids,
        pendingAddition: { nodes: newNodes, edges: newEdges },
        xp: s.xp + 150,
      };
    });
  },

  // Export for Canvas to use when building initial graph
  _getInitialGraph: generateInitialNodes,
}));

// Export helpers for Canvas
export { generateInitialNodes };

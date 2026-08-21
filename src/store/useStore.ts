"use client";

import { create } from "zustand";
import { type Node, type Edge } from "@xyflow/react";

export type AppMode = "skill-tree" | "arch" | "detective";

export interface NodeData extends Record<string, unknown> {
  label: string;
  description: string;
  type: "root" | "concept" | "branch" | "leaf";
  isGenerating?: boolean;
  depth?: number;
}

/** Pending additions pushed from generateBranch → consumed by Canvas */
interface PendingAddition {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

interface ChunkerStore {
  // Stats only — Canvas owns the live RF state
  nodeCount: number;
  edgeCount: number;
  // Pending additions for Canvas to pick up
  pendingAddition: PendingAddition | null;
  // UI state
  currentMode: AppMode;
  selectedNode: Node<NodeData> | null;
  // Monetization
  isPro: boolean;
  showPricing: boolean;
  // Generating node IDs
  generatingIds: Set<string>;

  setNodeCount: (n: number) => void;
  setEdgeCount: (n: number) => void;
  clearPendingAddition: () => void;
  setMode: (mode: AppMode) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  setIsPro: (v: boolean) => void;
  setShowPricing: (v: boolean) => void;
  generateBranch: (
    parentId: string,
    parentPos: { x: number; y: number },
    parentDepth: number,
    prompt: string
  ) => Promise<void>;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const BRANCH_CONTENT: Record<AppMode, { labels: string[]; descs: string[] }> = {
  "skill-tree": {
    labels: ["Vocabulary", "Grammar", "Pronunciation", "Listening", "Speaking", "Reading", "Writing", "Culture", "Idioms", "Slang"],
    descs: ["Master essential word patterns", "Structure your sentences with precision", "Perfect your accent and intonation", "Train your ear with native audio"],
  },
  arch: {
    labels: ["API Gateway", "Load Balancer", "Cache Layer", "Auth Service", "Message Queue", "Database", "CDN", "Monitoring", "CI/CD", "Orchestrator"],
    descs: ["Handles routing and rate limiting", "Distributes traffic across replicas", "Reduces latency with in-memory store", "Stateless JWT verification layer"],
  },
  detective: {
    labels: ["Witness Account", "Crime Scene Photo", "Forensic Report", "Suspect Profile", "Phone Records", "Security Footage", "Motive Analysis", "Alibi Check"],
    descs: ["Unverified testimony from source", "Evidence collected at 3:47 AM", "Classified — eyes only", "Cross-reference needed"],
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useStore = create<ChunkerStore>((set, get) => ({
  nodeCount: 1,
  edgeCount: 0,
  pendingAddition: null,
  currentMode: "skill-tree",
  selectedNode: null,
  isPro: false,
  showPricing: false,
  generatingIds: new Set(),

  setNodeCount: (n) => set({ nodeCount: n }),
  setEdgeCount: (n) => set({ edgeCount: n }),
  clearPendingAddition: () => set({ pendingAddition: null }),
  setMode: (mode) => set({ currentMode: mode }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setIsPro: (v) => set({ isPro: v }),
  setShowPricing: (v) => set({ showPricing: v }),

  generateBranch: async (parentId, parentPos, parentDepth, _prompt) => {
    // Mark as generating
    set((s) => ({
      generatingIds: new Set([...s.generatingIds, parentId]),
    }));

    await sleep(1000);

    const { currentMode } = get();
    const content = BRANCH_CONTENT[currentMode];
    const ts = Date.now();
    const SPREAD = 240;

    const newNodes: Node<NodeData>[] = [-1, 0, 1].map((offset, i) => ({
      id: `${parentId}-br-${ts}-${i}`,
      type: "skill",
      position: {
        x: parentPos.x + offset * SPREAD,
        y: parentPos.y + 180,
      },
      data: {
        label: pickRandom(content.labels),
        description: pickRandom(content.descs),
        type: "branch",
        isGenerating: false,
        depth: parentDepth + 1,
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
      };
    });
  },
}));

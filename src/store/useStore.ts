"use client";

import { create } from "zustand";
import { type Node, type Edge } from "@xyflow/react";
import {
  generateSmartChunks,
  type ChunkPayload,
  type BranchKind,
  type MicroTaskGroup,
} from "@/lib/semanticChunker";
import {
  applyFluidPhysicsLayout,
  calculateOutwardBranchPositions,
  ROOT_CENTER,
} from "@/lib/physicsLayout";

export type AppMode = "skill-tree" | "arch" | "detective";
export type AppPhase = "landing" | "canvas";

export interface SavedMapRecord {
  topic: string;
  mode: AppMode;
  nodes: Node<NodeData>[];
  edges: Edge[];
  xp: number;
  savedAt: string;
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  description: string;
  type: "root" | "concept" | "branch" | "leaf";
  branchKind?: BranchKind;
  isGenerating?: boolean;
  depth?: number;
  icon?: string;
  whyItMatters?: string;
  keyInsight?: string;
  actionableSteps?: string[];
  completedSteps?: boolean[];
  microTaskGroups?: MicroTaskGroup[];
  realWorldExample?: string;
  challengeQuestion?: string;
  challengeAnswer?: string;
  timeEstimate?: string;
  prerequisites?: string[];
  xpReward?: number;
  isMastered?: boolean;
}

interface PendingAddition {
  nodes: Node<NodeData>[];
  edges: Edge[];
  replaceFullGraph?: boolean;
}

interface ChunkerStore {
  // App phase & state
  phase: AppPhase;
  masterTopic: string;

  // Stats
  nodeCount: number;
  edgeCount: number;
  xp: number;
  masteredCount: number;
  thoughtCount: number;
  actionCount: number;

  // Current graph snapshot
  currentNodes: Node<NodeData>[];
  currentEdges: Edge[];
  pendingAddition: PendingAddition | null;

  // Multi-Mode Saved Progress (Pro feature)
  savedMaps: Record<AppMode, SavedMapRecord | null>;
  showSaveModal: boolean;
  pendingTargetMode: AppMode | null;

  // UI state
  currentMode: AppMode;
  selectedNode: Node<NodeData> | null;
  isPro: boolean;
  showPricing: boolean;
  showApiKeyModal: boolean;
  apiKey: string;
  generatingIds: Set<string>;
  isLoadingInitial: boolean;

  // Actions
  startMastery: (topic: string) => Promise<void>;
  resetToLanding: () => void;
  updateGraphSnapshot: (nodes: Node<NodeData>[], edges: Edge[]) => void;
  setNodeCount: (n: number) => void;
  setEdgeCount: (n: number) => void;
  addXp: (amount: number) => void;
  clearPendingAddition: () => void;
  setMode: (mode: AppMode) => void;
  requestModeSwitch: (targetMode: AppMode) => void;
  confirmModeSwitchFresh: () => void;
  saveCurrentMap: () => boolean;
  setShowSaveModal: (v: boolean) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  setIsPro: (v: boolean) => void;
  setShowPricing: (v: boolean) => void;
  setShowApiKeyModal: (v: boolean) => void;
  setApiKey: (key: string) => void;
  toggleStepComplete: (nodeId: string, stepIndex: number) => void;
  toggleGranularStep: (nodeId: string, groupIndex: number, stepIndex: number) => void;
  markNodeMastered: (nodeId: string) => void;
  generateBranch: (
    parentId: string,
    parentPos: { x: number; y: number },
    parentDepth: number,
    parentLabel: string
  ) => Promise<void>;
}

// ── Graph Builder with Mode-Specific Spacing ───────────────────────────────────
export function createInitialGraph(
  topic: string,
  mode: AppMode,
  chunks?: ChunkPayload[]
): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const cx = ROOT_CENTER.x;
  const cy = ROOT_CENTER.y;
  const radius = 440;

  const validChunks = chunks && chunks.length > 0
    ? chunks
    : generateSmartChunks(topic, topic, 0, mode);

  let rootIcon = "🎯";
  let rootDesc = `Mastery blueprint for "${topic}". Explore 💡 Thought Branches and execute ⚡ Action Missions.`;
  if (mode === "arch") {
    rootIcon = "🏗️";
    rootDesc = `Architecture specification for "${topic}". Ingress routing, core services, and distributed pipelines.`;
  } else if (mode === "detective") {
    rootIcon = "🗂️";
    rootDesc = `Case Dossier for "${topic}". Cross-examine clues, audit evidence, and test forensic hypotheses.`;
  }

  const rootNode: Node<NodeData> = {
    id: "root",
    type: "skill",
    position: { x: cx, y: cy },
    data: {
      label: topic,
      description: rootDesc,
      type: "root",
      branchKind: "thought",
      depth: 0,
      icon: rootIcon,
      whyItMatters: `Mastering ${topic} in ${mode.toUpperCase()} mode unlocks systematic execution capability.`,
      keyInsight: `Break down the problem into structured modules and verify each through action.`,
      actionableSteps: [
        `Review the satellite thought and action branches.`,
        `Select your first target node to begin.`,
        `Complete all micro-tasks in the Action Terminal.`
      ],
      completedSteps: [false, false, false],
      realWorldExample: `Leading industry practitioners use structured graph workflows to manage complex projects.`,
      challengeQuestion: `What is your primary breakthrough goal for ${topic}?`,
      challengeAnswer: `Building verifiable, production-ready competence from foundational principles.`,
      timeEstimate: "Active Board",
      xpReward: 100,
      isMastered: false,
    },
  };

  const satelliteNodes: Node<NodeData>[] = validChunks.map((chunk, i) => {
    const angle = (i / validChunks.length) * 2 * Math.PI - Math.PI / 2;
    return {
      id: `chunk-${i}`,
      type: "skill",
      position: {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      },
      data: {
        label: chunk.label,
        description: chunk.description,
        type: "concept",
        branchKind: chunk.branchKind || (i % 2 === 0 ? "thought" : "action"),
        depth: 1,
        icon: chunk.icon || (chunk.branchKind === "action" ? "⚡" : "💡"),
        whyItMatters: chunk.whyItMatters,
        keyInsight: chunk.keyInsight,
        actionableSteps: chunk.actionableSteps || [],
        completedSteps: (chunk.actionableSteps || []).map(() => false),
        microTaskGroups: chunk.microTaskGroups || [],
        realWorldExample: chunk.realWorldExample,
        challengeQuestion: chunk.challengeQuestion,
        challengeAnswer: chunk.challengeAnswer,
        timeEstimate: chunk.timeEstimate || "25 min",
        prerequisites: chunk.prerequisites || [],
        xpReward: chunk.xpReward || (chunk.branchKind === "action" ? 200 : 125),
        isMastered: false,
      },
    };
  });

  const rawEdges: Edge[] = satelliteNodes.map((n) => ({
    id: `e-root-${n.id}`,
    source: "root",
    target: n.id,
    animated: true,
    type: "smoothstep",
    style: {
      stroke: mode === "detective" ? "#dc2626" : n.data.branchKind === "action" ? "#fbbf24" : "var(--edge-color)",
      strokeWidth: 2,
    },
  }));

  const relaxedNodes = applyFluidPhysicsLayout([rootNode, ...satelliteNodes], rawEdges, 60);
  return { nodes: relaxedNodes, edges: rawEdges };
}

// ── Store ────────────────────────────────────────────────────────────────────
export const useStore = create<ChunkerStore>((set, get) => ({
  phase: "landing",
  masterTopic: "",
  nodeCount: 0,
  edgeCount: 0,
  xp: 0,
  masteredCount: 0,
  thoughtCount: 0,
  actionCount: 0,
  currentNodes: [],
  currentEdges: [],
  pendingAddition: null,

  savedMaps: {
    "skill-tree": null,
    arch: null,
    detective: null,
  },
  showSaveModal: false,
  pendingTargetMode: null,

  currentMode: "skill-tree",
  selectedNode: null,
  isPro: false,
  showPricing: false,
  showApiKeyModal: false,
  apiKey: typeof window !== "undefined" ? localStorage.getItem("chunker_api_key") || "" : "",
  generatingIds: new Set(),
  isLoadingInitial: false,

  updateGraphSnapshot: (nodes, edges) => {
    set({ currentNodes: nodes, currentEdges: edges });
  },

  startMastery: async (topic: string) => {
    const trimmed = topic.trim();
    const { currentMode, apiKey } = get();
    set({ phase: "canvas", masterTopic: trimmed, isLoadingInitial: true });

    try {
      const res = await fetch("/api/chunk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: trimmed,
          parentLabel: trimmed,
          currentMode,
          depth: 0,
          apiKey: apiKey || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.chunks && data.chunks.length > 0) {
          const initial = createInitialGraph(trimmed, currentMode, data.chunks);
          const thoughts = initial.nodes.filter((n) => n.data.branchKind === "thought").length;
          const actions = initial.nodes.filter((n) => n.data.branchKind === "action").length;
          set({
            pendingAddition: { nodes: initial.nodes, edges: initial.edges, replaceFullGraph: true },
            isLoadingInitial: false,
            thoughtCount: thoughts,
            actionCount: actions,
            xp: 100,
          });
          return;
        }
      }
    } catch {
      // Fallback
    }

    const initial = createInitialGraph(trimmed, currentMode);
    const thoughts = initial.nodes.filter((n) => n.data.branchKind === "thought").length;
    const actions = initial.nodes.filter((n) => n.data.branchKind === "action").length;
    set({
      pendingAddition: { nodes: initial.nodes, edges: initial.edges, replaceFullGraph: true },
      isLoadingInitial: false,
      thoughtCount: thoughts,
      actionCount: actions,
      xp: 100,
    });
  },

  resetToLanding: () => {
    set({
      phase: "landing",
      masterTopic: "",
      nodeCount: 0,
      edgeCount: 0,
      currentNodes: [],
      currentEdges: [],
      pendingAddition: null,
      generatingIds: new Set(),
      selectedNode: null,
      isLoadingInitial: false,
      masteredCount: 0,
    });
  },

  saveCurrentMap: () => {
    const { isPro, currentMode, masterTopic, currentNodes, currentEdges, xp, setShowPricing } = get();
    if (!isPro) {
      // Prompt Google Play monetization to unlock multi-slot save
      setShowPricing(true);
      return false;
    }

    if (!masterTopic || currentNodes.length === 0) return true;

    const record: SavedMapRecord = {
      topic: masterTopic,
      mode: currentMode,
      nodes: currentNodes,
      edges: currentEdges,
      xp,
      savedAt: new Date().toISOString(),
    };

    set((s) => ({
      savedMaps: {
        ...s.savedMaps,
        [currentMode]: record,
      },
    }));

    return true;
  },

  requestModeSwitch: (targetMode) => {
    const { currentMode, masterTopic, currentNodes, isPro, savedMaps, startMastery, setMode } = get();
    if (currentMode === targetMode) return;

    // If on landing screen or no active map, switch mode directly
    if (get().phase === "landing" || !masterTopic || currentNodes.length === 0) {
      setMode(targetMode);
      return;
    }

    // If Pro: Auto-save current mode and switch cleanly
    if (isPro) {
      get().saveCurrentMap();
      const existingSaved = savedMaps[targetMode];
      if (existingSaved) {
        // Restore saved map for target mode
        set({
          currentMode: targetMode,
          masterTopic: existingSaved.topic,
          pendingAddition: { nodes: existingSaved.nodes, edges: existingSaved.edges, replaceFullGraph: true },
          selectedNode: null,
        });
      } else {
        // Start fresh in target mode with same or clean prompt
        setMode(targetMode);
        startMastery(masterTopic);
      }
      return;
    }

    // If Free: Show Save / Paywall modal prompting user to either unlock Pro via Google Play or start fresh
    set({
      pendingTargetMode: targetMode,
      showSaveModal: true,
    });
  },

  confirmModeSwitchFresh: () => {
    const { pendingTargetMode, masterTopic, startMastery, setMode } = get();
    if (!pendingTargetMode) return;

    setMode(pendingTargetMode);
    set({ showSaveModal: false, pendingTargetMode: null });

    // Start fresh in the newly selected mode with its unique chunking architecture
    if (masterTopic) {
      startMastery(masterTopic);
    }
  },

  setShowSaveModal: (v) => set({ showSaveModal: v }),
  setNodeCount: (n) => set({ nodeCount: n }),
  setEdgeCount: (n) => set({ edgeCount: n }),
  addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
  clearPendingAddition: () => set({ pendingAddition: null }),
  setMode: (mode) => set({ currentMode: mode }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setIsPro: (v) => set({ isPro: v }),
  setShowPricing: (v) => set({ showPricing: v }),
  setShowApiKeyModal: (v) => set({ showApiKeyModal: v }),
  setApiKey: (key) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chunker_api_key", key);
    }
    set({ apiKey: key });
  },

  toggleStepComplete: (nodeId, stepIndex) => {
    const { selectedNode } = get();
    if (!selectedNode || selectedNode.id !== nodeId) return;

    const data = selectedNode.data as NodeData;
    const completed = [...(data.completedSteps || [])];
    const wasDone = completed[stepIndex];
    completed[stepIndex] = !wasDone;

    const allStepsDone = completed.length > 0 && completed.every(Boolean);

    const updatedNode = {
      ...selectedNode,
      data: {
        ...data,
        completedSteps: completed,
        isMastered: allStepsDone ? true : data.isMastered,
      },
    };

    set((s) => ({
      selectedNode: updatedNode,
      xp: wasDone ? s.xp - 50 : s.xp + 50,
      masteredCount: allStepsDone && !data.isMastered ? s.masteredCount + 1 : s.masteredCount,
    }));
  },

  toggleGranularStep: (nodeId, groupIndex, stepIndex) => {
    const { selectedNode } = get();
    if (!selectedNode || selectedNode.id !== nodeId) return;

    const data = selectedNode.data as NodeData;
    if (!data.microTaskGroups) return;

    const updatedGroups = JSON.parse(JSON.stringify(data.microTaskGroups)) as MicroTaskGroup[];
    const targetStep = updatedGroups[groupIndex]?.steps[stepIndex];
    if (!targetStep) return;

    const wasDone = targetStep.isDone || false;
    targetStep.isDone = !wasDone;

    // Check if all granular steps in this node are done
    const allGranularDone = updatedGroups.every((g) => g.steps.every((s) => s.isDone));

    const updatedNode = {
      ...selectedNode,
      data: {
        ...data,
        microTaskGroups: updatedGroups,
        isMastered: allGranularDone ? true : data.isMastered,
      },
    };

    set((s) => ({
      selectedNode: updatedNode,
      xp: wasDone ? s.xp - 25 : s.xp + 25,
      masteredCount: allGranularDone && !data.isMastered ? s.masteredCount + 1 : s.masteredCount,
    }));
  },

  markNodeMastered: (nodeId) => {
    const { selectedNode } = get();
    if (!selectedNode || selectedNode.id !== nodeId) return;

    const data = selectedNode.data as NodeData;
    const isNowMastered = !data.isMastered;
    const reward = data.xpReward || 200;

    const updatedGroups = data.microTaskGroups
      ? data.microTaskGroups.map((g) => ({
          ...g,
          steps: g.steps.map((s) => ({ ...s, isDone: isNowMastered })),
        }))
      : undefined;

    const updatedNode = {
      ...selectedNode,
      data: {
        ...data,
        isMastered: isNowMastered,
        completedSteps: isNowMastered ? (data.actionableSteps || []).map(() => true) : data.completedSteps,
        microTaskGroups: updatedGroups,
      },
    };

    set((s) => ({
      selectedNode: updatedNode,
      masteredCount: isNowMastered ? s.masteredCount + 1 : Math.max(0, s.masteredCount - 1),
      xp: isNowMastered ? s.xp + reward : Math.max(0, s.xp - reward),
    }));
  },

  generateBranch: async (parentId, parentPos, parentDepth, parentLabel) => {
    set((s) => ({
      generatingIds: new Set([...s.generatingIds, parentId]),
    }));

    const { currentMode, masterTopic, apiKey, currentNodes, currentEdges } = get();
    let chunks: ChunkPayload[] = [];

    try {
      const res = await fetch("/api/chunk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: masterTopic,
          parentLabel,
          currentMode,
          depth: parentDepth + 1,
          apiKey: apiKey || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.chunks && data.chunks.length > 0) {
          chunks = data.chunks.slice(0, 3);
        }
      }
    } catch {
      // Fallback
    }

    if (!chunks || chunks.length === 0) {
      chunks = generateSmartChunks(masterTopic, parentLabel, parentDepth + 1, currentMode).slice(0, 3);
    }

    const ts = Date.now();
    const branchPositions = calculateOutwardBranchPositions(
      parentId,
      parentPos,
      chunks.length
    );

    const newNodes: Node<NodeData>[] = chunks.map((chunk, i) => {
      const pos = branchPositions[i] || { x: parentPos.x + (i - 1) * 260, y: parentPos.y + 240 };
      return {
        id: `${parentId}-br-${ts}-${i}`,
        type: "skill",
        position: pos,
        data: {
          label: chunk.label,
          description: chunk.description,
          type: "branch" as const,
          branchKind: chunk.branchKind || (i % 2 === 0 ? "thought" : "action"),
          isGenerating: false,
          depth: parentDepth + 1,
          icon: chunk.icon || (chunk.branchKind === "action" ? "⚡" : "💡"),
          whyItMatters: chunk.whyItMatters,
          keyInsight: chunk.keyInsight,
          actionableSteps: chunk.actionableSteps || [],
          completedSteps: (chunk.actionableSteps || []).map(() => false),
          microTaskGroups: chunk.microTaskGroups || [],
          realWorldExample: chunk.realWorldExample,
          challengeQuestion: chunk.challengeQuestion,
          challengeAnswer: chunk.challengeAnswer,
          timeEstimate: chunk.timeEstimate || (chunk.branchKind === "action" ? "25 min mission" : "15 min concept"),
          prerequisites: chunk.prerequisites || [],
          xpReward: chunk.xpReward || 150,
          isMastered: false,
        },
      };
    });

    const newEdges: Edge[] = newNodes.map((n) => ({
      id: `e-${parentId}-${n.id}`,
      source: parentId,
      target: n.id,
      animated: true,
      type: "smoothstep",
      style: {
        stroke: currentMode === "detective" ? "#dc2626" : n.data.branchKind === "action" ? "#fbbf24" : "var(--edge-color)",
        strokeWidth: 2,
      },
    }));

    const combinedNodes = [...currentNodes, ...newNodes];
    const combinedEdges = [...currentEdges, ...newEdges];
    const relaxedAllNodes = applyFluidPhysicsLayout(combinedNodes, combinedEdges, 70);

    set((s) => {
      const ids = new Set(s.generatingIds);
      ids.delete(parentId);
      const thoughts = newNodes.filter((n) => n.data.branchKind === "thought").length;
      const actions = newNodes.filter((n) => n.data.branchKind === "action").length;
      return {
        generatingIds: ids,
        pendingAddition: {
          nodes: relaxedAllNodes,
          edges: combinedEdges,
          replaceFullGraph: true,
        },
        thoughtCount: s.thoughtCount + thoughts,
        actionCount: s.actionCount + actions,
        xp: s.xp + 150,
      };
    });
  },
}));

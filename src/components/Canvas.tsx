"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  addEdge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useStore, createInitialGraph, type NodeData, type AppMode } from "@/store/useStore";
import { nodeTypes } from "@/lib/nodeTypes";

const BG_VARIANT: Record<AppMode, BackgroundVariant> = {
  "skill-tree": BackgroundVariant.Dots,
  arch: BackgroundVariant.Lines,
  detective: BackgroundVariant.Cross,
};
const BG_COLOR: Record<AppMode, string> = {
  "skill-tree": "#4ade8033",
  arch: "#22d3ee22",
  detective: "#8B451322",
};
const MINIMAP_COLOR: Record<AppMode, string> = {
  "skill-tree": "#4ade80",
  arch: "#22d3ee",
  detective: "#8B4513",
};

interface XpToast {
  id: number;
  amount: number;
}

export default function Canvas() {
  const {
    currentMode,
    masterTopic,
    pendingAddition,
    clearPendingAddition,
    generatingIds,
    selectedNode,
    setSelectedNode,
    setNodeCount,
    setEdgeCount,
    generateBranch,
    addXp,
    resetToLanding,
  } = useStore();

  const initialGraph = useRef(createInitialGraph(masterTopic, currentMode)).current;
  const [nodes, setLocalNodes, onNodesChange] = useNodesState<Node<NodeData>>(initialGraph.nodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState<Edge>(initialGraph.edges);
  const [xpToasts, setXpToasts] = useState<XpToast[]>([]);
  const toastCounter = useRef(0);

  // ── Consume pending additions ──────────────────────────────────────────────
  useEffect(() => {
    if (!pendingAddition) return;
    setLocalNodes((prev) => [...prev, ...(pendingAddition.nodes as Node<NodeData>[])]);
    setLocalEdges((prev) => [...prev, ...pendingAddition.edges]);
    clearPendingAddition();

    const id = ++toastCounter.current;
    setXpToasts((t) => [...t, { id, amount: 150 }]);
    setTimeout(() => setXpToasts((t) => t.filter((x) => x.id !== id)), 2000);
  }, [pendingAddition, setLocalNodes, setLocalEdges, clearPendingAddition]);

  // ── Sync generating state ──────────────────────────────────────────────────
  useEffect(() => {
    setLocalNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: { ...n.data, isGenerating: generatingIds.has(n.id) },
      }))
    );
  }, [generatingIds, setLocalNodes]);

  // ── Sync mastered state from selectedNode back to local node list ──────────
  useEffect(() => {
    if (!selectedNode) return;
    setLocalNodes((prev) =>
      prev.map((n) => (n.id === selectedNode.id ? (selectedNode as Node<NodeData>) : n))
    );
  }, [selectedNode, setLocalNodes]);

  // ── Report counts (debounced) ──────────────────────────────────────────────
  const statsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (statsTimer.current) clearTimeout(statsTimer.current);
    statsTimer.current = setTimeout(() => {
      setNodeCount(nodes.length);
      setEdgeCount(edges.length);
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleNodesChange: OnNodesChange<Node<NodeData>> = useCallback(
    (changes) => onNodesChange(changes),
    [onNodesChange]
  );
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => onEdgesChange(changes),
    [onEdgesChange]
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setLocalEdges((eds) => addEdge({ ...params, animated: true, type: "smoothstep" }, eds)),
    [setLocalEdges]
  );
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node as Node<NodeData>);
      addXp(25);
    },
    [setSelectedNode, addXp]
  );
  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const data = node.data as NodeData;
      generateBranch(node.id, node.position, data.depth ?? 0, data.label);
    },
    [generateBranch]
  );
  const onPaneClick = useCallback(() => setSelectedNode(null), [setSelectedNode]);

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        position: "relative",
        background: "var(--bg-canvas)",
        transition: "background 0.4s ease",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.05}
        maxZoom={2.5}
        defaultEdgeOptions={{
          animated: true,
          type: "smoothstep",
          style: { stroke: "var(--edge-color, var(--border-node))", strokeWidth: 2 },
        }}
        style={{ background: "transparent" }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BG_VARIANT[currentMode]}
          color={BG_COLOR[currentMode]}
          gap={currentMode === "arch" ? 28 : 20}
          size={currentMode === "arch" ? 1 : 1.5}
        />
        <Controls
          style={{
            background: "var(--bg-node)",
            border: "1px solid var(--border-node)",
            borderRadius: 8,
          }}
        />
        <MiniMap
          nodeColor={() => MINIMAP_COLOR[currentMode]}
          maskColor="rgba(0,0,0,0.5)"
          style={{
            background: "var(--minimap-bg, #0a0d0f)",
            border: "1px solid var(--border-node)",
            borderRadius: 8,
          }}
        />
      </ReactFlow>

      {/* Mastery Legend bar */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--border-node)",
          borderRadius: 12,
          padding: "8px 20px",
          fontSize: 11,
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-family)",
          boxShadow: "0 0 20px var(--glow-color)",
          zIndex: 10,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span>💡</span> <strong style={{ color: "var(--accent)" }}>Thought Branches</strong>: Mental Models
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span>⚡</span> <strong style={{ color: "#fbbf24" }}>Action Branches</strong>: Micro-Missions
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ color: "var(--text-primary)" }}>Click node to inspect & execute</span>
      </div>

      {/* Back button */}
      <button
        id="back-to-landing"
        onClick={resetToLanding}
        title="Choose new topic"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          padding: "6px 14px",
          borderRadius: 8,
          border: "1px solid var(--border-node)",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-family)",
          fontSize: 11,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-node)";
        }}
      >
        ← New Topic
      </button>

      {/* XP toasts */}
      <div style={{ position: "absolute", top: 60, right: 20, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none", zIndex: 20 }}>
        {xpToasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: "var(--accent)",
              color: "var(--bg-canvas)",
              padding: "4px 12px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: "var(--font-family)",
              animation: "float-up 2s ease-out forwards",
              boxShadow: "0 0 12px var(--glow-color)",
            }}
          >
            +{t.amount} XP
          </div>
        ))}
      </div>
    </div>
  );
}

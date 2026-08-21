"use client";

import React, { useCallback, useEffect, useRef } from "react";
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

import { useStore, type NodeData, type AppMode } from "@/store/useStore";
import { nodeTypes } from "@/lib/nodeTypes";

const INITIAL_NODES: Node<NodeData>[] = [
  {
    id: "root",
    type: "skill",
    position: { x: 400, y: 280 },
    data: {
      label: "Start Here",
      description: "Double-click any node to generate branches. Single-click to inspect.",
      type: "root",
      depth: 0,
    },
  },
];

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

/**
 * Canvas — React Flow full-screen workspace.
 *
 * State architecture (no circular loops):
 * - Canvas owns node/edge positions via useNodesState / useEdgesState
 * - Store signals new nodes via `pendingAddition` — Canvas merges them in and
 *   calls `clearPendingAddition` (one-way: store → canvas)
 * - Canvas reports counts back to store via debounced setNodeCount/setEdgeCount
 *   (one-way: canvas → store stats only, never triggers re-sync)
 */
export default function Canvas() {
  const {
    currentMode,
    pendingAddition,
    clearPendingAddition,
    generatingIds,
    setSelectedNode,
    setNodeCount,
    setEdgeCount,
    generateBranch,
  } = useStore();

  const [nodes, setLocalNodes, onNodesChange] = useNodesState<Node<NodeData>>(INITIAL_NODES);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // ── Consume pending additions from generateBranch ──────────────────────────
  useEffect(() => {
    if (!pendingAddition) return;
    setLocalNodes((prev) => [...prev, ...(pendingAddition.nodes as Node<NodeData>[])]);
    setLocalEdges((prev) => [...prev, ...pendingAddition.edges]);
    clearPendingAddition();
  }, [pendingAddition, setLocalNodes, setLocalEdges, clearPendingAddition]);

  // ── Sync generating state onto nodes (visual pulse) ─────────────────────────
  useEffect(() => {
    if (generatingIds.size === 0) return;
    setLocalNodes((prev) =>
      prev.map((n) =>
        generatingIds.has(n.id)
          ? { ...n, data: { ...n.data, isGenerating: true } }
          : { ...n, data: { ...n.data, isGenerating: false } }
      )
    );
  }, [generatingIds, setLocalNodes]);

  useEffect(() => {
    if (generatingIds.size > 0) return;
    setLocalNodes((prev) =>
      prev.map((n) =>
        n.data.isGenerating ? { ...n, data: { ...n.data, isGenerating: false } } : n
      )
    );
  }, [generatingIds, setLocalNodes]);

  // ── Report counts to store (debounced, never triggers re-sync) ───────────────
  const statsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (statsTimer.current) clearTimeout(statsTimer.current);
    statsTimer.current = setTimeout(() => {
      setNodeCount(nodes.length);
      setEdgeCount(edges.length);
    }, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length]);

  // ── Handlers ────────────────────────────────────────────────────────────────
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
    (_: React.MouseEvent, node: Node) => setSelectedNode(node as Node<NodeData>),
    [setSelectedNode]
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
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.08}
        maxZoom={2.5}
        defaultEdgeOptions={{
          animated: true,
          type: "smoothstep",
          style: { stroke: "var(--edge-color)", strokeWidth: 2 },
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

      {nodes.length === 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--border-node)",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 12,
            color: "var(--text-muted)",
            pointerEvents: "none",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-family)",
            boxShadow: "0 0 20px var(--glow-color)",
          }}
        >
          ✦ Double-click to branch · Single-click to inspect
        </div>
      )}
    </div>
  );
}

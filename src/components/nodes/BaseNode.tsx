"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useStore, type NodeData } from "@/store/useStore";

interface BaseNodeProps extends NodeProps {
  data: NodeData;
  /** Extra class names injected by mode-specific nodes */
  extraClass?: string;
  children?: React.ReactNode;
}

export default function BaseNode({ data, selected, extraClass = "", children }: BaseNodeProps) {
  const { currentMode } = useStore();
  const isRoot = data.type === "root";

  return (
    <div
      style={{
        background: "var(--bg-node)",
        border: `2px solid ${selected ? "var(--accent)" : "var(--border-node)"}`,
        borderRadius: "var(--node-radius, 12px)",
        fontFamily: "var(--font-family)",
        color: "var(--text-primary)",
        boxShadow: selected
          ? "0 0 0 3px var(--accent), 0 0 20px var(--glow-color)"
          : "0 0 12px var(--glow-color)",
        transition: "box-shadow 0.25s ease, border-color 0.3s ease",
        minWidth: 160,
        maxWidth: 220,
        position: "relative",
        cursor: "grab",
      }}
      className={`chunker-node ${extraClass} ${data.isGenerating ? "generating" : ""}`}
      title="Double-click to branch · Single-click to inspect"
    >
      {/* Pulse ring for generating state */}
      {data.isGenerating && (
        <div
          className="animate-pulse-ring"
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "inherit",
            border: "2px solid var(--border-node)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Depth badge */}
      {(data.depth ?? 0) > 0 && (
        <div
          style={{
            position: "absolute",
            top: -10,
            right: 8,
            background: "var(--accent)",
            color: "var(--bg-canvas)",
            fontSize: 9,
            fontWeight: 700,
            padding: "1px 5px",
            borderRadius: 99,
            letterSpacing: "0.05em",
          }}
        >
          {currentMode === "skill-tree"
            ? `LVL ${data.depth}`
            : currentMode === "arch"
            ? `L${data.depth}`
            : `CLUE`}
        </div>
      )}

      {/* Content area */}
      <div style={{ padding: "12px 14px" }}>
        {children ?? (
          <>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              {isRoot ? "◈ Origin" : "◆ Node"}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.3,
                marginBottom: 4,
              }}
            >
              {data.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                lineHeight: 1.4,
              }}
            >
              {data.description}
            </div>
          </>
        )}
      </div>

      {/* React Flow handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "var(--accent)",
          border: "2px solid var(--bg-node)",
          width: 10,
          height: 10,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "var(--border-node)",
          border: "2px solid var(--bg-node)",
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}

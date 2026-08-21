"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useStore, type NodeData } from "@/store/useStore";

export default function SkillNode({ data, selected, id }: NodeProps & { data: NodeData }) {
  const { generateBranch } = useStore();

  const icons: Record<string, string> = { root: "✦", concept: "◈", branch: "◆", leaf: "◇" };

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        // Pass position via the DOM — React Flow injects position as style transform
        const el = e.currentTarget.closest(".react-flow__node") as HTMLElement | null;
        // We can't easily read position here; generateBranch is called by Canvas onNodeDoubleClick instead
        // This handler is a fallback only
        void id;
      }}
      style={{
        background: "var(--bg-node)",
        border: `2px solid ${selected ? "var(--accent)" : "var(--border-node)"}`,
        borderRadius: "var(--node-radius, 12px)",
        fontFamily: "var(--font-family)",
        color: "var(--text-primary)",
        boxShadow: selected
          ? "0 0 0 3px var(--accent), 0 0 24px var(--glow-color)"
          : "0 0 14px var(--glow-color), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.25s ease",
        minWidth: 164,
        maxWidth: 224,
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
      }}
      title="Double-click to branch · Single-click to inspect"
    >
      {data.isGenerating && (
        <div
          className="animate-pulse-ring"
          style={{
            position: "absolute",
            inset: -7,
            borderRadius: "inherit",
            border: "2px solid var(--border-node)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}

      {/* Header stripe */}
      <div
        style={{
          background:
            data.type === "root"
              ? "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)"
              : "linear-gradient(135deg, var(--border-node) 0%, transparent 100%)",
          padding: "6px 12px",
          borderRadius: "calc(var(--node-radius, 12px) - 2px) calc(var(--node-radius, 12px) - 2px) 0 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 14 }}>{icons[data.type] ?? "◆"}</span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: data.type === "root" ? "var(--bg-canvas)" : "var(--text-primary)",
            opacity: 0.9,
          }}
        >
          {data.type === "root" ? "Origin Node" : data.type}
        </span>
        {(data.depth ?? 0) > 0 && (
          <span
            style={{
              marginLeft: "auto",
              background: "var(--accent)",
              color: "var(--bg-canvas)",
              fontSize: 8,
              fontWeight: 800,
              padding: "1px 5px",
              borderRadius: 99,
            }}
          >
            LV {data.depth}
          </span>
        )}
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginBottom: 5, color: "var(--text-primary)" }}>
          {data.label}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.45 }}>
          {data.description}
        </div>
      </div>

      <Handle type="target" position={Position.Top} style={{ background: "var(--accent)", border: "2px solid var(--bg-node)", width: 10, height: 10 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "var(--border-node)", border: "2px solid var(--bg-node)", width: 10, height: 10 }} />
    </div>
  );
}

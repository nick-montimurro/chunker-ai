"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type NodeData } from "@/store/useStore";

export default function DetectiveNode({ data, selected }: NodeProps & { data: NodeData }) {
  const rotation = ((data.label.length % 7) - 3) * 1.2;

  return (
    <div
      style={{
        background: "var(--bg-node)",
        border: `2px solid ${selected ? "var(--accent)" : "var(--border-node)"}`,
        borderRadius: "var(--node-radius, 3px)",
        fontFamily: "var(--font-family)",
        color: "var(--text-primary)",
        boxShadow: selected ? "0 0 0 3px var(--accent), 4px 6px 16px rgba(0,0,0,0.5)" : "3px 5px 14px rgba(0,0,0,0.45)",
        transform: `rotate(${rotation}deg)`,
        transition: "box-shadow 0.25s ease, transform 0.2s ease",
        minWidth: 150,
        maxWidth: 210,
        position: "relative",
        cursor: "pointer",
      }}
      title="Double-click to branch · Single-click to inspect"
    >
      {data.isGenerating && (
        <div className="animate-pulse-ring" style={{ position: "absolute", inset: -7, borderRadius: "inherit", border: "2px solid var(--accent)", pointerEvents: "none" }} />
      )}

      {/* Pushpin */}
      <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--border-node)", boxShadow: "0 2px 4px rgba(0,0,0,0.4)", zIndex: 10 }} />

      <div style={{ background: "linear-gradient(135deg, rgba(139,69,19,0.15) 0%, rgba(139,69,19,0.05) 100%)", height: 60, margin: "14px 8px 0", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "1px solid rgba(139,69,19,0.2)" }}>
        {data.type === "root" ? "🔍" : data.type === "branch" ? "📎" : "📷"}
      </div>

      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, color: "var(--text-primary)" }}>{data.label}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.45, fontStyle: "italic" }}>{data.description}</div>
        {(data.depth ?? 0) > 0 && (
          <div style={{ marginTop: 6, fontSize: 9, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>CLUE #{data.depth}</div>
        )}
      </div>

      <Handle type="target" position={Position.Top} style={{ background: "var(--accent)", border: "2px solid var(--bg-node)", width: 8, height: 8, top: -4 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "var(--border-node)", border: "2px solid var(--bg-node)", width: 8, height: 8 }} />
    </div>
  );
}

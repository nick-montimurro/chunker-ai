"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type NodeData } from "@/store/useStore";

export default function ArchNode({ data, selected }: NodeProps & { data: NodeData }) {
  const isAction = data.branchKind === "action";
  const isMastered = data.isMastered;

  const borderColor = isMastered
    ? "#fbbf24"
    : selected
    ? "var(--accent)"
    : isAction
    ? "#38bdf8"
    : "var(--border-node)";

  return (
    <div
      style={{
        background: "var(--bg-node)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--node-radius, 2px)",
        fontFamily: "var(--font-family)",
        color: "var(--text-primary)",
        boxShadow: isMastered
          ? "0 0 0 2px #fbbf24, 0 0 25px rgba(251,191,36,0.35)"
          : selected
          ? "0 0 0 2px var(--accent), 0 0 20px var(--glow-color)"
          : "0 0 10px var(--glow-color)",
        transition: "all 0.25s ease",
        minWidth: 180,
        maxWidth: 245,
        position: "relative",
        cursor: "pointer",
      }}
      title="Click to inspect in Mastery Terminal · Double-click to expand"
    >
      {data.isGenerating && (
        <div className="animate-pulse-ring" style={{ position: "absolute", inset: -6, borderRadius: "inherit", border: "1px solid var(--border-node)", pointerEvents: "none" }} />
      )}

      <div style={{ background: isAction ? "rgba(56,189,248,0.15)" : "rgba(34,211,238,0.12)", borderBottom: "1px solid var(--border-node)", padding: "5px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
        </div>
        <span style={{ fontSize: 9, color: isAction ? "#38bdf8" : "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", flex: 1, textAlign: "center", fontWeight: 700 }}>
          {isMastered ? "✓ [DEPLOYED]" : isAction ? "$ [EXECUTION]" : "$ [ARCHITECTURE]"}
        </span>
        {(data.depth ?? 0) > 0 && <span style={{ fontSize: 9, color: "var(--accent)", fontWeight: 700 }}>L{data.depth}</span>}
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontSize: 9, color: "var(--accent)", marginBottom: 3, letterSpacing: "0.05em" }}>
          {data.icon || (isAction ? "⚡" : "⚙️")} {isAction ? "task.run()" : "spec.model"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--border-node)", marginBottom: 5 }}>{data.label}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.5, fontStyle: "italic" }}>// {data.description}</div>
      </div>

      <Handle type="target" position={Position.Top} style={{ background: "var(--accent)", border: "2px solid var(--bg-node)", width: 10, height: 10, borderRadius: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: isAction ? "#38bdf8" : "var(--border-node)", border: "2px solid var(--bg-node)", width: 10, height: 10, borderRadius: 0 }} />
    </div>
  );
}

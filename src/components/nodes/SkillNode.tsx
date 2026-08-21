"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type NodeData } from "@/store/useStore";

export default function SkillNode({ data, selected }: NodeProps & { data: NodeData }) {
  const isAction = data.branchKind === "action";
  const isMastered = data.isMastered;
  const isRoot = data.type === "root";

  const borderColor = isMastered
    ? "#fbbf24"
    : selected
    ? "var(--accent)"
    : isAction
    ? "#fbbf24"
    : "var(--border-node)";

  return (
    <div
      style={{
        background: "var(--bg-node)",
        border: `2px solid ${borderColor}`,
        borderRadius: "var(--node-radius, 12px)",
        fontFamily: "var(--font-family)",
        color: "var(--text-primary)",
        boxShadow: isMastered
          ? "0 0 0 3px rgba(251,191,36,0.5), 0 0 25px rgba(251,191,36,0.3)"
          : selected
          ? "0 0 0 3px var(--accent), 0 0 24px var(--glow-color)"
          : isAction
          ? "0 0 16px rgba(251,191,36,0.25)"
          : "0 0 14px var(--glow-color), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.25s ease",
        minWidth: 175,
        maxWidth: 240,
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
      }}
      title="Click to inspect in Mastery Terminal · Double-click to expand"
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

      {/* Header stripe with branch kind badge */}
      <div
        style={{
          background: isMastered
            ? "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)"
            : isRoot
            ? "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)"
            : isAction
            ? "linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(217,119,6,0.1) 100%)"
            : "linear-gradient(135deg, var(--border-node)22 0%, transparent 100%)",
          padding: "6px 10px",
          borderRadius: "calc(var(--node-radius, 12px) - 2px) calc(var(--node-radius, 12px) - 2px) 0 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderBottom: `1px solid ${isAction ? "rgba(251,191,36,0.3)" : "var(--border-node)33"}`,
        }}
      >
        <span style={{ fontSize: 14 }}>{data.icon || (isAction ? "⚡" : "💡")}</span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isMastered ? "#0d1117" : isAction ? "#fbbf24" : "var(--accent)",
          }}
        >
          {isMastered ? "✓ MASTERED" : isRoot ? "ORIGIN TOPIC" : isAction ? "ACTION MISSION" : "THOUGHT CHUNK"}
        </span>
        {(data.depth ?? 0) > 0 && (
          <span
            style={{
              marginLeft: "auto",
              background: isAction ? "#fbbf24" : "var(--accent)",
              color: "var(--bg-canvas)",
              fontSize: 8,
              fontWeight: 800,
              padding: "1px 5px",
              borderRadius: 99,
            }}
          >
            L{data.depth}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 5, color: "var(--text-primary)" }}>
          {data.label}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.45, marginBottom: 8 }}>
          {data.description}
        </div>

        {/* Step progress pills if action */}
        {isAction && data.actionableSteps && data.actionableSteps.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            {data.actionableSteps.map((_, idx) => {
              const done = data.completedSteps?.[idx];
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: done ? "#fbbf24" : "rgba(255,255,255,0.15)",
                    transition: "background 0.2s ease",
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Top} style={{ background: "var(--accent)", border: "2px solid var(--bg-node)", width: 10, height: 10 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: isAction ? "#fbbf24" : "var(--border-node)", border: "2px solid var(--bg-node)", width: 10, height: 10 }} />
    </div>
  );
}

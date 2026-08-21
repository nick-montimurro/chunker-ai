"use client";

import React from "react";
import { useStore, type AppMode } from "@/store/useStore";

const MODES: { id: AppMode; label: string; icon: string }[] = [
  { id: "skill-tree", label: "Skill Tree", icon: "⚔️" },
  { id: "arch", label: "Architecture", icon: "⚙️" },
  { id: "detective", label: "Detective Board", icon: "🔍" },
];

export default function TopNav() {
  const { currentMode, setMode, nodeCount, edgeCount, isPro, setShowPricing, xp, masterTopic } =
    useStore();

  return (
    <nav
      style={{
        height: 52,
        background: "var(--bg-nav)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-node)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        flexShrink: 0,
        fontFamily: "var(--font-family)",
        zIndex: 20,
        position: "relative",
      }}
    >
      {/* Brand + topic */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            boxShadow: "0 0 10px var(--glow-color)",
            flexShrink: 0,
          }}
        >
          ✦
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Chunker·AI
          </span>
          {masterTopic && (
            <span
              style={{
                fontSize: 9,
                color: "var(--accent)",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Mastering: {masterTopic.length > 22 ? masterTopic.slice(0, 22) + "…" : masterTopic}
            </span>
          )}
        </div>
      </div>

      {/* Mode toggles */}
      <div
        style={{
          display: "flex",
          gap: 4,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            id={`nav-mode-${m.id}`}
            onClick={() => setMode(m.id)}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              border: `1px solid ${currentMode === m.id ? "var(--accent)" : "transparent"}`,
              background:
                currentMode === m.id
                  ? "linear-gradient(135deg, var(--accent)22 0%, transparent 100%)"
                  : "transparent",
              color: currentMode === m.id ? "var(--accent)" : "var(--text-muted)",
              fontFamily: "var(--font-family)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 13 }}>{m.icon}</span>
            <span style={{ display: "inline" }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Stats + XP + Pro */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          fontSize: 11,
          color: "var(--text-muted)",
          letterSpacing: "0.04em",
        }}
      >
        <span>
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>{nodeCount}</span> nodes
        </span>
        <span>
          <span style={{ color: "var(--border-node)", fontWeight: 700 }}>{edgeCount}</span> edges
        </span>

        {/* XP Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            background: "rgba(74,222,128,0.08)",
            border: "1px solid var(--accent)",
            borderRadius: 99,
            color: "var(--accent)",
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          ⚡ {xp} XP
        </div>

        {/* Live indicator */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 8px",
            background: "rgba(74,222,128,0.1)",
            border: "1px solid var(--border-node)",
            borderRadius: 99,
            color: "var(--border-node)",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--border-node)",
              animation: "pulse-ring 1.4s ease-in-out infinite",
            }}
          />
          Live
        </span>

        {!isPro && (
          <button
            id="nav-upgrade-btn"
            onClick={() => setShowPricing(true)}
            style={{
              padding: "4px 12px",
              borderRadius: 99,
              border: "1px solid var(--accent)",
              background: "linear-gradient(135deg, var(--accent)22 0%, var(--border-node)11 100%)",
              color: "var(--accent)",
              fontFamily: "var(--font-family)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              boxShadow: "0 0 10px var(--glow-color)",
              whiteSpace: "nowrap",
            }}
          >
            ✦ Pro
          </button>
        )}
        {isPro && (
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 99,
              background: "var(--accent)",
              color: "var(--bg-canvas)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            PRO
          </span>
        )}
      </div>
    </nav>
  );
}

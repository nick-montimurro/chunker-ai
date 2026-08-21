"use client";

import React from "react";
import { useStore, type AppMode } from "@/store/useStore";

const MODES: { id: AppMode; label: string; emoji: string; hint: string }[] = [
  {
    id: "skill-tree",
    label: "Skill Tree",
    emoji: "⚔️",
    hint: "RPG language learning graph",
  },
  {
    id: "arch",
    label: "Architecture",
    emoji: "🖥️",
    hint: "System design workflow",
  },
  {
    id: "detective",
    label: "Detective Board",
    emoji: "🔍",
    hint: "Corkboard investigation map",
  },
];

export default function TopNav() {
  const { currentMode, setMode, nodeCount, edgeCount, isPro, setShowPricing } = useStore();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 56,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-node)",
        flexShrink: 0,
        zIndex: 50,
        fontFamily: "var(--font-family)",
        gap: 16,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            boxShadow: "0 0 12px var(--glow-color)",
          }}
        >
          ✦
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
          }}
        >
          Chunker<span style={{ color: "var(--accent)" }}>-AI</span>
        </span>
      </div>

      {/* Mode Toggle Buttons */}
      <div
        style={{
          display: "flex",
          gap: 6,
          background: "rgba(0,0,0,0.3)",
          padding: "4px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.07)",
        }}
        role="group"
        aria-label="Theme mode selector"
      >
        {MODES.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              id={`mode-btn-${m.id}`}
              onClick={() => setMode(m.id)}
              title={m.hint}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 7,
                border: isActive
                  ? "1px solid var(--border-node)"
                  : "1px solid transparent",
                background: isActive
                  ? "linear-gradient(135deg, var(--border-node)22 0%, var(--accent)11 100%)"
                  : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: "var(--font-family)",
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 0 8px var(--glow-color)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 14 }}>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stats */}
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
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border-node)", animation: "pulse-ring 1.4s ease-in-out infinite" }} />
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
            ✦ Upgrade Pro
          </button>
        )}
        {isPro && (
          <span style={{ padding: "3px 10px", borderRadius: 99, background: "var(--accent)", color: "var(--bg-canvas)", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em" }}>
            PRO
          </span>
        )}
      </div>
    </nav>
  );
}

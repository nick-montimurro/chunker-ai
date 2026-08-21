"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore, type AppMode } from "@/store/useStore";

const MODES: { id: AppMode; label: string; icon: string; desc: string }[] = [
  { id: "skill-tree", label: "Skill Tree", icon: "⚔️", desc: "RPG mastery path" },
  { id: "arch", label: "Architecture", icon: "⚙️", desc: "Systems thinking" },
  { id: "detective", label: "Detective", icon: "🔍", desc: "Evidence mapping" },
];

const PLACEHOLDERS = [
  "machine learning from scratch…",
  "stoic philosophy and resilience…",
  "building a SaaS product…",
  "quantum computing fundamentals…",
  "mastering negotiations…",
  "the history of ancient Rome…",
  "TypeScript advanced patterns…",
  "investing and personal finance…",
];

const EXAMPLES = [
  "Machine Learning", "Photography", "Spanish", "Chess", "Investing",
  "System Design", "Public Speaking", "Meditation", "Guitar", "Neuroscience",
];

export default function LandingScreen() {
  const { currentMode, setMode, startMastery, setShowPricing, isPro } = useStore();
  const [topic, setTopic] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder text
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    // Brief delay for the transition animation
    setTimeout(() => startMastery(trimmed), 600);
  };

  const handleExample = (ex: string) => {
    setTopic(ex);
    setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-canvas)",
        fontFamily: "var(--font-family)",
        overflow: "hidden",
        zIndex: 50,
        transition: "opacity 0.5s ease",
        opacity: isSubmitting ? 0 : 1,
      }}
    >
      {/* Background particle grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, var(--glow-color) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--glow-color) 0%, transparent 50%)
          `,
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      {/* Top right monetization CTA */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 60,
        }}
      >
        {!isPro ? (
          <button
            id="landing-upgrade-pro-btn"
            onClick={() => setShowPricing(true)}
            style={{
              padding: "7px 16px",
              borderRadius: 99,
              border: "1px solid var(--accent)",
              background: "linear-gradient(135deg, var(--accent)22 0%, var(--border-node)11 100%)",
              color: "var(--accent)",
              fontFamily: "var(--font-family)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              boxShadow: "0 0 14px var(--glow-color)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>✦</span>
            <span>Upgrade Pro</span>
          </button>
        ) : (
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 99,
              background: "var(--accent)",
              color: "var(--bg-canvas)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            PRO ACTIVE
          </span>
        )}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 680,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            marginBottom: 20,
            boxShadow: "0 0 40px var(--glow-color), 0 0 80px var(--glow-color)",
            animation: "pulse-ring 2.5s ease-in-out infinite",
          }}
        >
          ✦
        </div>

        {/* Brand */}
        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textAlign: "center",
            background: `linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
          }}
        >
          Chunker<span style={{ color: "var(--accent)", WebkitTextFillColor: "var(--accent)" }}>·AI</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: "0 0 36px",
            fontSize: "clamp(14px, 2.5vw, 17px)",
            color: "var(--text-muted)",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 500,
          }}
        >
          Type anything you'd like to master. Chunk the knowledge.{" "}
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>Become the expert you were always meant to be.</span>
        </p>

        {/* Main input form */}
        <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: 16 }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "var(--bg-node)",
              border: `2px solid ${topic ? "var(--accent)" : "var(--border-node)"}`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: topic ? "0 0 30px var(--glow-color)" : "0 4px 24px rgba(0,0,0,0.3)",
              transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 20,
                fontSize: 20,
                pointerEvents: "none",
                color: "var(--accent)",
              }}
            >
              ✦
            </span>
            <input
              ref={inputRef}
              id="mastery-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`I want to master ${PLACEHOLDERS[placeholderIdx]}`}
              style={{
                flex: 1,
                padding: "18px 18px 18px 52px",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "clamp(14px, 2vw, 17px)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-family)",
                caretColor: "var(--accent)",
              }}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!topic.trim() || isSubmitting}
              style={{
                margin: "8px 10px 8px 0",
                padding: "10px 22px",
                borderRadius: 10,
                border: "none",
                background: topic.trim()
                  ? "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)"
                  : "rgba(255,255,255,0.06)",
                color: topic.trim() ? "var(--bg-canvas)" : "var(--text-muted)",
                fontFamily: "var(--font-family)",
                fontSize: 14,
                fontWeight: 800,
                cursor: topic.trim() ? "pointer" : "not-allowed",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                transition: "all 0.25s ease",
                boxShadow: topic.trim() ? "0 0 16px var(--glow-color)" : "none",
              }}
            >
              {isSubmitting ? "Building…" : "Start Mastery →"}
            </button>
          </div>
        </form>

        {/* Mode selector */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 28,
          }}
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              id={`mode-btn-${m.id}`}
              onClick={() => setMode(m.id)}
              title={m.desc}
              style={{
                padding: "7px 16px",
                borderRadius: 99,
                border: `1px solid ${currentMode === m.id ? "var(--accent)" : "var(--border-node)"}`,
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
              }}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Quick-start examples */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Quick start
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                id={`example-${ex.toLowerCase().replace(/\s/g, "-")}`}
                onClick={() => handleExample(ex)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  border: "1px solid var(--border-node)",
                  background: "rgba(255,255,255,0.03)",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-family)",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)18";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-node)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: 36,
            fontSize: 11,
            color: "var(--text-muted)",
            opacity: 0.5,
            textAlign: "center",
          }}
        >
          Take actionable, manageable steps towards mastery ✦ Double-click nodes to branch deeper
        </p>
      </div>
    </div>
  );
}

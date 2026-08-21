"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";

export default function ApiKeyModal() {
  const { showApiKeyModal, setShowApiKeyModal, apiKey, setApiKey } = useStore();
  const [inputVal, setInputVal] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!showApiKeyModal) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputVal.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowApiKeyModal(false);
    }, 800);
  };

  return (
    <>
      <div
        id="api-key-backdrop"
        onClick={() => setShowApiKeyModal(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 110,
        }}
      />

      <div
        id="api-key-modal"
        role="dialog"
        aria-modal="true"
        aria-label="AI Cognitive Brain Settings"
        className="animate-fade-in"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 111,
          background: "var(--bg-node)",
          border: "1px solid var(--border-node)",
          borderRadius: 16,
          boxShadow: "0 0 50px var(--glow-color)",
          padding: "28px 24px",
          width: "min(500px, 92vw)",
          fontFamily: "var(--font-family)",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 24 }}>🧠</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>AI Cognitive Brain Settings</h3>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
              Power thought & action branches with live Google Gemini 2.5 Flash
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-node)",
                background: "rgba(0,0,0,0.3)",
                color: "var(--text-primary)",
                fontFamily: "monospace",
                fontSize: 13,
                outline: "none",
              }}
            />
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
              Don&apos;t have one? Get a free key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)", textDecoration: "underline" }}
              >
                aistudio.google.com
              </a>
              . If left empty, Chunker-AI uses its built-in Semantic Mastery Engine.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setShowApiKeyModal(false)}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 18px",
                borderRadius: 6,
                border: "none",
                background: "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)",
                color: "var(--bg-canvas)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {saved ? "✓ Saved!" : "Save Key"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

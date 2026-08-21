"use client";

import React from "react";
import { useStore } from "@/store/useStore";

const MODE_NAMES: Record<string, string> = {
  "skill-tree": "⚔️ Skill Builder (RPG Tree)",
  arch: "⚙️ Architecture (Systems Pipeline)",
  detective: "🔍 Detective Board (Evidence Web)",
};

export default function SaveModal() {
  const {
    showSaveModal,
    setShowSaveModal,
    pendingTargetMode,
    currentMode,
    confirmModeSwitchFresh,
    setShowPricing,
  } = useStore();

  if (!showSaveModal) return null;

  const targetName = pendingTargetMode ? MODE_NAMES[pendingTargetMode] : "New Mode";
  const currentName = MODE_NAMES[currentMode];

  return (
    <>
      <div
        id="save-modal-backdrop"
        onClick={() => setShowSaveModal(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 120,
        }}
      />

      <div
        id="save-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Save Progress & Switch Mode"
        className="animate-fade-in"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 121,
          background: "var(--bg-node)",
          border: "2px solid var(--accent)",
          borderRadius: 16,
          boxShadow: "0 0 60px var(--glow-color), 0 20px 40px rgba(0,0,0,0.8)",
          padding: "32px 28px",
          width: "min(540px, 94vw)",
          fontFamily: "var(--font-family)",
          color: "var(--text-primary)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent)22 0%, #fbbf24 100%)",
              border: "2px solid var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 16px",
              boxShadow: "0 0 20px var(--glow-color)",
            }}
          >
            💾
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>
            Save Your Progress in <span style={{ color: "var(--accent)" }}>{currentName}</span>?
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Each mode uses a completely different chunking architecture and graphing engine. To preserve your active board across modes, unlock multi-slot save via Google Play.
          </p>
        </div>

        {/* Action Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {/* Primary CTA: Upgrade via Google Play */}
          <button
            id="save-modal-upgrade-btn"
            onClick={() => {
              setShowSaveModal(false);
              setShowPricing(true);
            }}
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              border: "1px solid var(--accent)",
              background: "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)",
              color: "var(--bg-canvas)",
              fontFamily: "var(--font-family)",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 0 20px var(--glow-color)",
              letterSpacing: "0.02em",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>✦</span>
              <span>Save Progress & Unlock Multi-Board Access</span>
            </div>
            <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(0,0,0,0.3)" }}>
              Google Play Pro
            </span>
          </button>

          {/* Secondary Option: Start Fresh in Target Mode */}
          {pendingTargetMode && (
            <button
              id="save-modal-fresh-btn"
              onClick={confirmModeSwitchFresh}
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                border: "1px solid var(--border-node)66",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-family)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                lineHeight: 1.4,
              }}
            >
              <div>🚀 Start Fresh in <strong>{targetName}</strong></div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                Discard unsaved board and initialize a new {targetName} blueprint.
              </div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setShowSaveModal(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 12,
              cursor: "pointer",
              padding: "4px 10px",
            }}
          >
            Cancel & Keep Current Board
          </button>
        </div>
      </div>
    </>
  );
}

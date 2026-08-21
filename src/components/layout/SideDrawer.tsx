"use client";

import React from "react";
import { type Node } from "@xyflow/react";
import { useStore, type NodeData } from "@/store/useStore";

interface SideDrawerProps {
  node: Node<NodeData> | null;
}

const MODE_LABELS = {
  "skill-tree": { title: "Skill Details", badge: "XP Node" },
  arch: { title: "Service Info", badge: "Component" },
  detective: { title: "Evidence File", badge: "Case Note" },
};

export default function SideDrawer({ node }: SideDrawerProps) {
  const { currentMode, generateBranch, setSelectedNode, setShowPricing } = useStore();
  const isOpen = node !== null;
  const meta = MODE_LABELS[currentMode];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          id="drawer-backdrop"
          onClick={() => setSelectedNode(null)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(1px)",
            zIndex: 40,
          }}
        />
      )}

      {/* Drawer Panel */}
      <aside
        id="side-drawer"
        aria-label="Node detail panel"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 360,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-node)",
          borderLeft: "1px solid var(--border-node)",
          boxShadow: isOpen ? "-8px 0 32px rgba(0,0,0,0.5)" : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "var(--font-family)",
          overflow: "hidden",
        }}
      >
        {node && (
          <div
            className="animate-fade-in"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Header */}
            <div
              style={{
                padding: "18px 20px 16px",
                borderBottom: "1px solid var(--border-node)",
                background: "linear-gradient(135deg, var(--border-node)15 0%, transparent 100%)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    background: "var(--accent)18",
                    padding: "3px 8px",
                    borderRadius: 99,
                    border: "1px solid var(--accent)44",
                  }}
                >
                  {meta.badge}
                </span>
                <button
                  id="drawer-close-btn"
                  onClick={() => setSelectedNode(null)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border-node)",
                    borderRadius: 6,
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "2px 8px",
                    lineHeight: 1,
                    transition: "all 0.15s",
                  }}
                  aria-label="Close drawer"
                >
                  ✕
                </button>
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                }}
              >
                {node.data.label}
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {node.data.description}
              </p>
            </div>

            {/* Metadata */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-node)44",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 10,
                }}
              >
                {meta.title}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "ID", value: node.id },
                  { label: "Type", value: node.data.type },
                  { label: "Depth", value: `Level ${node.data.depth ?? 0}` },
                  {
                    label: "Position",
                    value: `${Math.round(node.position.x)}, ${Math.round(node.position.y)}`,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: 6,
                      padding: "8px 10px",
                      border: "1px solid var(--border-node)33",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: "var(--text-muted)",
                        marginBottom: 2,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        wordBreak: "break-all",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: "16px 20px", flexShrink: 0 }}>
              <button
                id="drawer-generate-btn"
                onClick={() => {
                  generateBranch(
                    node.id,
                    node.position ?? { x: 400, y: 300 },
                    node.data.depth ?? 0,
                    node.data.label
                  );
                  setSelectedNode(null);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid var(--border-node)",
                  background:
                    "linear-gradient(135deg, var(--border-node)22 0%, var(--accent)11 100%)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-family)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                  letterSpacing: "0.04em",
                  boxShadow: "0 0 12px var(--glow-color)",
                }}
              >
                <span>✦</span>
                <span>Generate Branches</span>
              </button>

              <button
                id="drawer-upgrade-pro-btn"
                onClick={() => setShowPricing(true)}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "9px",
                  borderRadius: 8,
                  border: "1px solid var(--accent)",
                  background:
                    "linear-gradient(135deg, var(--accent)18 0%, transparent 100%)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-family)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <span>⚡</span>
                <span>Upgrade to Pro (Play Billing)</span>
              </button>

              <button
                id="drawer-dismiss-btn"
                onClick={() => setSelectedNode(null)}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "8px",
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-family)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Close Inspector
              </button>
            </div>

            {/* Tip */}
            <div
              style={{
                marginTop: "auto",
                padding: "12px 20px",
                borderTop: "1px solid var(--border-node)33",
                fontSize: 10,
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              💡 <strong>Tip:</strong> Double-click any node on the canvas to instantly branch it.
              Use the mode toggle to switch themes.
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

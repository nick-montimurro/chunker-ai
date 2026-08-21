"use client";

import React, { useState } from "react";
import { type Node } from "@xyflow/react";
import { useStore, type NodeData } from "@/store/useStore";

interface SideDrawerProps {
  node: Node<NodeData> | null;
}

export default function SideDrawer({ node }: SideDrawerProps) {
  const {
    currentMode,
    generateBranch,
    setSelectedNode,
    setShowPricing,
    toggleStepComplete,
    toggleGranularStep,
    markNodeMastered,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"action" | "insight" | "quiz">("action");
  const [showAnswer, setShowAnswer] = useState(false);
  // Track which microtask accordions are open
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({ 0: true });

  const isOpen = node !== null;
  if (!isOpen || !node) return null;

  const data = node.data as NodeData;
  const isAction = data.branchKind === "action";
  const isMastered = data.isMastered;

  // Compute total granular progress if available
  const hasMicroGroups = data.microTaskGroups && data.microTaskGroups.length > 0;
  let totalGranularSteps = 0;
  let completedGranularSteps = 0;

  if (hasMicroGroups) {
    data.microTaskGroups?.forEach((g) => {
      g.steps.forEach((s) => {
        totalGranularSteps++;
        if (s.isDone) completedGranularSteps++;
      });
    });
  }

  const completedCount = hasMicroGroups ? completedGranularSteps : (data.completedSteps || []).filter(Boolean).length;
  const totalSteps = hasMicroGroups ? totalGranularSteps : data.actionableSteps?.length || 0;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : isMastered ? 100 : 0;

  const toggleGroupAccordion = (idx: number) => {
    setExpandedGroups((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="drawer-backdrop"
        onClick={() => setSelectedNode(null)}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 30,
        }}
      />

      {/* Drawer Panel */}
      <aside
        id="side-drawer"
        role="dialog"
        aria-label={data.label}
        className="animate-slide-in"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(490px, 94vw)",
          background: "var(--bg-node)",
          borderLeft: "1px solid var(--border-node)",
          zIndex: 31,
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-family)",
          color: "var(--text-primary)",
          boxShadow: "-14px 0 40px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            padding: "18px 20px 14px",
            background: isMastered
              ? "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(217,119,6,0.05) 100%)"
              : isAction
              ? "linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(217,119,6,0.05) 100%)"
              : "linear-gradient(135deg, var(--border-node)22 0%, transparent 100%)",
            borderBottom: "1px solid var(--border-node)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>{data.icon || (isAction ? "⚡" : "💡")}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: isMastered ? "#fbbf24" : isAction ? "#fbbf24" : "var(--accent)",
                  color: "var(--bg-canvas)",
                }}
              >
                {isMastered ? "✓ Mastered" : isAction ? "Action Mission" : "Thought Chunk"}
              </span>
              {data.timeEstimate && (
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
                  ⏱ {data.timeEstimate}
                </span>
              )}
            </div>

            <button
              id="drawer-close-btn"
              onClick={() => setSelectedNode(null)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid var(--border-node)",
                background: "rgba(0,0,0,0.3)",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>

          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, lineHeight: 1.3, color: "var(--text-primary)" }}>
            {data.label}
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.45 }}>
            {data.description}
          </p>

          {/* Progress bar */}
          {totalSteps > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>
                <span>Action Checklist Progress</span>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                  {completedCount}/{totalSteps} Steps ({progressPct}%)
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: isMastered ? "#fbbf24" : "var(--accent)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-node)",
            background: "rgba(0,0,0,0.25)",
            padding: "0 8px",
          }}
        >
          {[
            { id: "action", label: "⚡ Action Steps", badge: `${completedCount}/${totalSteps}` },
            { id: "insight", label: "💡 Deep Insight", badge: undefined },
            { id: "quiz", label: "🎯 Self-Check", badge: undefined },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                flex: 1,
                padding: "10px 4px",
                border: "none",
                background: "transparent",
                borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
                color: activeTab === tab.id ? "var(--accent)" : "var(--text-muted)",
                fontFamily: "var(--font-family)",
                fontSize: 11,
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                transition: "all 0.2s",
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    fontSize: 9,
                    padding: "1px 5px",
                    borderRadius: 99,
                    background: "rgba(255,255,255,0.1)",
                    color: "var(--text-primary)",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {activeTab === "action" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)" }}>
                  Step-by-Step Micro-Task Breakdown
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  +25 to 50 XP per step
                </div>
              </div>

              {/* ── Dropdown / Accordion Micro-Task Groups ── */}
              {hasMicroGroups ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.microTaskGroups?.map((group, gIdx) => {
                    const isExpanded = expandedGroups[gIdx] ?? true;
                    const groupDoneCount = group.steps.filter((s) => s.isDone).length;
                    const isGroupDone = group.steps.length > 0 && groupDoneCount === group.steps.length;

                    return (
                      <div
                        key={group.id || gIdx}
                        style={{
                          border: `1px solid ${isGroupDone ? "var(--accent)" : "var(--border-node)"}`,
                          borderRadius: 10,
                          background: isGroupDone ? "rgba(74,222,128,0.06)" : "rgba(0,0,0,0.25)",
                          overflow: "hidden",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* Accordion Header / Dropdown Toggle */}
                        <div
                          onClick={() => toggleGroupAccordion(gIdx)}
                          style={{
                            padding: "10px 14px",
                            background: "rgba(255,255,255,0.03)",
                            borderBottom: isExpanded ? "1px solid var(--border-node)44" : "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            userSelect: "none",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                              ▶
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: isGroupDone ? "var(--accent)" : "var(--text-primary)" }}>
                              {group.title}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, color: "var(--text-muted)", padding: "1px 6px", borderRadius: 99, background: "rgba(0,0,0,0.3)" }}>
                              {groupDoneCount}/{group.steps.length} Done
                            </span>
                          </div>
                        </div>

                        {/* Accordion Body: Manageable Sub-Steps */}
                        {isExpanded && (
                          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                            {group.overview && (
                              <p style={{ margin: "0 0 6px", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                                {group.overview}
                              </p>
                            )}

                            {group.steps.map((step, sIdx) => (
                              <div
                                key={step.id || sIdx}
                                style={{
                                  padding: "10px 12px",
                                  borderRadius: 8,
                                  border: `1px solid ${step.isDone ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
                                  background: step.isDone ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 6,
                                }}
                              >
                                <div
                                  onClick={() => toggleGranularStep(node.id, gIdx, sIdx)}
                                  style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}
                                >
                                  <div
                                    style={{
                                      width: 18,
                                      height: 18,
                                      borderRadius: 4,
                                      border: `2px solid ${step.isDone ? "var(--accent)" : "var(--text-muted)"}`,
                                      background: step.isDone ? "var(--accent)" : "transparent",
                                      color: "var(--bg-canvas)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 11,
                                      fontWeight: 900,
                                      flexShrink: 0,
                                      marginTop: 1,
                                    }}
                                  >
                                    {step.isDone ? "✓" : ""}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: step.isDone ? "var(--text-muted)" : "var(--text-primary)", textDecoration: step.isDone ? "line-through" : "none" }}>
                                      {step.title}
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.45, marginTop: 2 }}>
                                      {step.detail}
                                    </div>
                                  </div>
                                  {step.timeEstimate && (
                                    <span style={{ fontSize: 9, color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>
                                      ⏱ {step.timeEstimate}
                                    </span>
                                  )}
                                </div>

                                {/* Concrete Command / Code Snippet */}
                                {step.commandSnippet && (
                                  <div
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: 6,
                                      background: "rgba(0,0,0,0.5)",
                                      border: "1px solid rgba(255,255,255,0.06)",
                                      fontFamily: "monospace",
                                      fontSize: 10,
                                      color: "#86efac",
                                      overflowX: "auto",
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-all",
                                    }}
                                  >
                                    $ {step.commandSnippet}
                                  </div>
                                )}

                                {/* Verification Outcome */}
                                {step.verificationOutcome && (
                                  <div style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ color: "var(--accent)" }}>✓ Verification:</span>
                                    <span>{step.verificationOutcome}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Fallback single-level tasks */
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.actionableSteps?.map((step, idx) => {
                    const isDone = data.completedSteps?.[idx] || false;
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStepComplete(node.id, idx)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: `1px solid ${isDone ? "var(--accent)" : "var(--border-node)"}`,
                          background: isDone ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: `2px solid ${isDone ? "var(--accent)" : "var(--text-muted)"}`,
                            background: isDone ? "var(--accent)" : "transparent",
                            color: "var(--bg-canvas)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 900,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          {isDone ? "✓" : ""}
                        </div>
                        <div style={{ fontSize: 12, lineHeight: 1.45, color: isDone ? "var(--text-muted)" : "var(--text-primary)", textDecoration: isDone ? "line-through" : "none" }}>
                          {step}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {data.realWorldExample && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.3)",
                    borderLeft: "3px solid var(--border-node)",
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 3, textTransform: "uppercase", fontSize: 9 }}>
                    Real-World Implementation
                  </div>
                  <div style={{ color: "var(--text-muted)" }}>{data.realWorldExample}</div>
                </div>
              )}
            </div>
          )}

          {activeTab === "insight" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {data.whyItMatters && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 5 }}>
                    Why This Matters for Mastery
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--text-primary)", background: "rgba(255,255,255,0.03)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-node)33" }}>
                    {data.whyItMatters}
                  </div>
                </div>
              )}

              {data.keyInsight && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#fbbf24", letterSpacing: "0.06em", marginBottom: 5 }}>
                    High-Leverage Mental Model / Rule
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: "#fef3c7", background: "rgba(251,191,36,0.08)", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(251,191,36,0.3)", fontStyle: "italic" }}>
                    &ldquo;{data.keyInsight}&rdquo;
                  </div>
                </div>
              )}

              {data.prerequisites && data.prerequisites.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: 5 }}>
                    Suggested Prerequisites
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {data.prerequisites.map((p, i) => (
                      <span key={i} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-node)44", color: "var(--text-muted)" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "quiz" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "var(--accent)", letterSpacing: "0.06em" }}>
                Active Recall Self-Check
              </div>

              {data.challengeQuestion ? (
                <div style={{ padding: "14px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-node)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.45, marginBottom: 12, color: "var(--text-primary)" }}>
                    ❓ {data.challengeQuestion}
                  </div>

                  {showAnswer ? (
                    <div style={{ padding: "10px 12px", borderRadius: 6, background: "rgba(74,222,128,0.1)", border: "1px solid var(--accent)", fontSize: 12, lineHeight: 1.45, color: "var(--text-primary)" }}>
                      <span style={{ fontWeight: 700, color: "var(--accent)" }}>Answer: </span>
                      {data.challengeAnswer}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAnswer(true)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 6,
                        border: "1px solid var(--border-node)",
                        background: "rgba(255,255,255,0.05)",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-family)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      👁 Reveal Answer
                    </button>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Test your understanding by explaining this concept aloud in your own words.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border-node)", background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              id="drawer-master-btn"
              onClick={() => markNodeMastered(node.id)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: isMastered ? "1px solid #fbbf24" : "1px solid var(--accent)",
                background: isMastered
                  ? "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)"
                  : "linear-gradient(135deg, var(--accent)22 0%, transparent 100%)",
                color: isMastered ? "#0d1117" : "var(--accent)",
                fontFamily: "var(--font-family)",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
            >
              <span>{isMastered ? "✓ Mastered" : "✦ Mark Mastered (+200 XP)"}</span>
            </button>

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
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border-node)",
                background: "linear-gradient(135deg, var(--border-node)22 0%, transparent 100%)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-family)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <span>⚡</span>
              <span>Branch Deeper</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              id="drawer-upgrade-pro-btn"
              onClick={() => setShowPricing(true)}
              style={{
                flex: 1,
                padding: "7px",
                borderRadius: 6,
                border: "1px solid var(--border-node)44",
                background: "transparent",
                color: "var(--accent)",
                fontFamily: "var(--font-family)",
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span>⚡ Pro Save & Multi-Mode</span>
            </button>

            <button
              id="drawer-dismiss-btn"
              onClick={() => setSelectedNode(null)}
              style={{
                flex: 1,
                padding: "7px",
                borderRadius: 6,
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                fontFamily: "var(--font-family)",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

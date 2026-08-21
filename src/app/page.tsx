"use client";

import dynamic from "next/dynamic";
import { useStore } from "@/store/useStore";
import AppShell from "@/components/layout/AppShell";
import TopNav from "@/components/layout/TopNav";
import SideDrawer from "@/components/layout/SideDrawer";
import PricingModal from "@/components/PricingModal";
import LandingScreen from "@/components/LandingScreen";
import ApiKeyModal from "@/components/ApiKeyModal";
import SaveModal from "@/components/SaveModal";

/**
 * Canvas uses browser-only APIs (ResizeObserver, DOM measurements).
 * Dynamic import with ssr:false prevents hydration errors.
 */
const Canvas = dynamic(() => import("@/components/Canvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-canvas)",
        color: "var(--text-muted)",
        fontFamily: "var(--font-family)",
        fontSize: 14,
        gap: 10,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          animation: "spin-slow 2s linear infinite",
          boxShadow: "0 0 20px var(--glow-color)",
        }}
      >
        ✦
      </div>
      <span style={{ color: "var(--text-muted)" }}>Initializing neural canvas…</span>
    </div>
  ),
});

export default function HomePage() {
  const { currentMode, selectedNode, phase } = useStore();

  return (
    <AppShell mode={currentMode}>
      {phase === "landing" ? (
        <LandingScreen />
      ) : (
        <>
          <TopNav />
          <main
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <Canvas />
            <SideDrawer node={selectedNode} />
          </main>
        </>
      )}
      {/* Modals rendered at root level so they overlay everything */}
      <PricingModal />
      <ApiKeyModal />
      <SaveModal />
    </AppShell>
  );
}

"use client";

import React from "react";
import { type AppMode } from "@/store/useStore";

interface AppShellProps {
  mode: AppMode;
  children: React.ReactNode;
}

/**
 * AppShell — full-screen wrapper that applies the active theme class.
 * The theme class drives all CSS custom property swaps in globals.css.
 */
export default function AppShell({ mode, children }: AppShellProps) {
  return (
    <div
      className={`theme-${mode}`}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-canvas)",
        transition: "background 0.4s ease",
      }}
    >
      {children}
    </div>
  );
}

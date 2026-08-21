import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chunker-AI — Gamified Node Exploration",
  description:
    "A gamified, AI-powered node-based exploration app with Skill Tree, Architecture Workflow, and Detective Board themes.",
  keywords: ["AI", "mind map", "skill tree", "node graph", "learning", "architecture"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chunker-AI",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#4ade80",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — via <link> to avoid Turbopack @import ordering issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Share+Tech+Mono&family=Special+Elite&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* PWA icons */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}

"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { useMonetization, PRODUCTS, type ProductId } from "@/hooks/useMonetization";

export default function PricingModal() {
  const { showPricing, setShowPricing, isPro } = useStore();
  const { purchase, isTWA } = useMonetization();
  const [loadingId, setLoadingId] = useState<ProductId | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!showPricing || isPro) return null;

  const handlePurchase = async (productId: ProductId) => {
    setLoadingId(productId);
    setErrorMsg(null);
    const ok = await purchase(productId);
    setLoadingId(null);
    if (!ok) setErrorMsg("Purchase could not be completed. Please try again.");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="pricing-backdrop"
        onClick={() => setShowPricing(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        id="pricing-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Chunker-AI Pro upgrade"
        className="animate-fade-in"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 101,
          background: "var(--bg-node)",
          border: "1px solid var(--border-node)",
          borderRadius: 16,
          boxShadow: "0 0 60px var(--glow-color), 0 24px 48px rgba(0,0,0,0.6)",
          padding: "32px 28px",
          width: "min(580px, 94vw)",
          fontFamily: "var(--font-family)",
          color: "var(--text-primary)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, var(--accent) 0%, var(--border-node) 100%)",
              fontSize: 28,
              marginBottom: 14,
              boxShadow: "0 0 20px var(--glow-color)",
            }}
          >
            ✦
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>
            Upgrade to <span style={{ color: "var(--accent)" }}>Chunker-AI Pro</span>
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Unlimited branches · Export maps · All themes · Priority AI generation
          </p>
          {isTWA && (
            <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--border-node)", fontWeight: 600 }}>
              📱 Billed via Google Play — secure & cancelable anytime
            </p>
          )}
        </div>

        {/* Plans */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              id={`pricing-btn-${product.id}`}
              onClick={() => handlePurchase(product.id)}
              disabled={loadingId !== null}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: 10,
                border: `1px solid ${product.badge === "BEST VALUE" ? "var(--accent)" : "var(--border-node)"}`,
                background:
                  product.badge === "BEST VALUE"
                    ? "linear-gradient(135deg, var(--accent)18 0%, var(--border-node)0a 100%)"
                    : "rgba(0,0,0,0.2)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-family)",
                cursor: loadingId !== null ? "not-allowed" : "pointer",
                opacity: loadingId !== null && loadingId !== product.id ? 0.5 : 1,
                transition: "all 0.2s",
                textAlign: "left",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{product.title}</span>
                  {product.badge && (
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: 99,
                        background: "var(--accent)",
                        color: "var(--bg-canvas)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                  {product.description}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>
                  {loadingId === product.id ? (
                    <span style={{ fontSize: 14 }}>Processing…</span>
                  ) : (
                    product.price
                  )}
                </div>
                {product.period && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{product.period}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {errorMsg && (
          <p style={{ textAlign: "center", fontSize: 12, color: "#f87171", marginBottom: 12 }}>
            ⚠ {errorMsg}
          </p>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          <button
            id="pricing-close-btn"
            onClick={() => setShowPricing(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontFamily: "var(--font-family)",
              fontSize: 12,
              cursor: "pointer",
              padding: "4px 12px",
            }}
          >
            Maybe later
          </button>
          <p style={{ margin: "10px 0 0", fontSize: 10, color: "var(--text-muted)", lineHeight: 1.4 }}>
            {isTWA
              ? "Managed by Google Play · Cancel anytime in Play Store settings"
              : "Secure payment · Cancel anytime · All prices in USD"}
          </p>
        </div>
      </div>
    </>
  );
}

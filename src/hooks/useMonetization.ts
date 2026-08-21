"use client";

import { useCallback, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

/**
 * Google Play Billing via the Digital Goods API (TWA context).
 *
 * When running as a TWA on Android, `window.getDigitalGoodsService` is
 * available. On web (Vercel/browser), we fall back to a Stripe-compatible
 * web flow or a simulated success for development.
 *
 * Product IDs must match those configured in Google Play Console:
 *   - chunker_pro_monthly   → $4.99/month subscription
 *   - chunker_pro_yearly    → $39.99/year subscription
 *   - chunker_pro_lifetime  → $99.99 one-time purchase
 */

export type ProductId =
  | "chunker_pro_monthly"
  | "chunker_pro_yearly"
  | "chunker_pro_lifetime";

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  price: string;
  period?: string;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "chunker_pro_monthly",
    title: "Pro Monthly",
    description: "Unlimited branches, all themes, export to PNG/JSON",
    price: "$4.99",
    period: "/ month",
  },
  {
    id: "chunker_pro_yearly",
    title: "Pro Yearly",
    description: "Best value — 2 months free, all Pro features",
    price: "$39.99",
    period: "/ year",
    badge: "BEST VALUE",
  },
  {
    id: "chunker_pro_lifetime",
    title: "Lifetime",
    description: "Pay once, own forever — all future features included",
    price: "$99.99",
    badge: "ONE-TIME",
  },
];

// TWA Digital Goods Service endpoint
const PLAY_BILLING_SERVICE = "https://play.google.com/billing";

interface UseMonetizationReturn {
  purchase: (productId: ProductId) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  isReady: boolean;
  isTWA: boolean;
}

export function useMonetization(): UseMonetizationReturn {
  const { setIsPro, setShowPricing } = useStore();
  const serviceRef = useRef<unknown>(null);
  const isTWARef = useRef(false);

  useEffect(() => {
    // Check if running as a TWA with Digital Goods API available
    if (typeof window === "undefined") return;

    const hasDGA =
      "getDigitalGoodsService" in window &&
      typeof (window as unknown as Record<string, unknown>).getDigitalGoodsService === "function";

    if (hasDGA) {
      isTWARef.current = true;
      (window as unknown as { getDigitalGoodsService: (url: string) => Promise<unknown> })
        .getDigitalGoodsService(PLAY_BILLING_SERVICE)
        .then((service) => {
          serviceRef.current = service;
        })
        .catch(() => {
          isTWARef.current = false;
        });
    }

    // Restore from localStorage (for web sessions)
    const stored = localStorage.getItem("chunker_pro_active");
    if (stored === "true") setIsPro(true);
  }, [setIsPro]);

  const purchase = useCallback(
    async (productId: ProductId): Promise<boolean> => {
      try {
        if (isTWARef.current && serviceRef.current) {
          // ── TWA / Google Play Billing path ──────────────────────────────────
          const service = serviceRef.current as {
            getDetails: (ids: string[]) => Promise<unknown[]>;
          };
          const details = await service.getDetails([productId]);
          if (!details || details.length === 0) return false;

          // @ts-expect-error — Digital Goods API is not in TS stdlib yet
          const paymentRequest = new PaymentRequest(
            [{ supportedMethods: PLAY_BILLING_SERVICE, data: { sku: productId } }],
            { total: { label: "Chunker-AI Pro", amount: { currency: "USD", value: "0" } } }
          );
          const paymentResponse = await paymentRequest.show();
          await paymentResponse.complete("success");

          localStorage.setItem("chunker_pro_active", "true");
          setIsPro(true);
          setShowPricing(false);
          return true;
        } else {
          // ── Web fallback: Stripe redirect (wire up in prod) ─────────────────
          // In production, redirect to /api/checkout?product=productId
          // For now we simulate success after a short delay (dev mode)
          await new Promise((r) => setTimeout(r, 1200));
          localStorage.setItem("chunker_pro_active", "true");
          setIsPro(true);
          setShowPricing(false);
          return true;
        }
      } catch {
        return false;
      }
    },
    [setIsPro, setShowPricing]
  );

  const restorePurchases = useCallback(async () => {
    if (isTWARef.current && serviceRef.current) {
      try {
        const service = serviceRef.current as {
          listPurchases: () => Promise<Array<{ itemId: string }>>;
        };
        const purchases = await service.listPurchases();
        const hasPro = purchases.some((p) =>
          (["chunker_pro_monthly", "chunker_pro_yearly", "chunker_pro_lifetime"] as string[]).includes(
            p.itemId
          )
        );
        if (hasPro) {
          localStorage.setItem("chunker_pro_active", "true");
          setIsPro(true);
        }
      } catch {
        // Silently fail restore
      }
    }
  }, [setIsPro]);

  return {
    purchase,
    restorePurchases,
    isReady: true,
    isTWA: isTWARef.current,
  };
}

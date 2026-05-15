import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "ywee:currency:v1";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  rate: number;            // 1 INR = rate * <currency>
  locale: string;
  decimals: number;
  flag: string;
}

// Approximate 2026 rates — used for display only; checkout still settles in INR.
export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  INR: { code: "INR", symbol: "₹",  rate: 1,        locale: "en-IN", decimals: 0, flag: "🇮🇳" },
  USD: { code: "USD", symbol: "$",  rate: 0.012,    locale: "en-US", decimals: 2, flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€",  rate: 0.011,    locale: "en-IE", decimals: 2, flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£",  rate: 0.0094,   locale: "en-GB", decimals: 2, flag: "🇬🇧" },
  AED: { code: "AED", symbol: "AED", rate: 0.044,   locale: "en-AE", decimals: 2, flag: "🇦🇪" },
};

interface CurrencyContextValue {
  currency: CurrencyMeta;
  setCurrency: (c: CurrencyCode) => void;
  format: (priceInINR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function load(): CurrencyCode {
  if (typeof window === "undefined") return "INR";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && raw in CURRENCIES) return raw as CurrencyCode;
  } catch {}
  return "INR";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, code); } catch {}
  }, [code]);

  const currency = CURRENCIES[code];
  const format = (inr: number) => {
    const v = inr * currency.rate;
    if (currency.decimals === 0) {
      return `${currency.symbol}${Math.round(v).toLocaleString(currency.locale)}`;
    }
    return `${currency.symbol}${v.toFixed(currency.decimals)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCode, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type Currency,
  DEFAULT_CURRENCY,
  CURRENCY_CONFIG,
  COUNTRY_TO_CURRENCY,
  formatPrice as formatPriceUtil,
} from "@/lib/constants/plans";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number | null) => string;
  currencySymbol: string;
  isDetecting: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/** Maps timezone to likely country code */
function getCountryFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzMap: Record<string, string> = {
      "Asia/Dubai": "AE",
      "America/New_York": "US",
      "America/Los_Angeles": "US",
      "America/Chicago": "US",
      "America/Denver": "US",
      "Europe/London": "GB",
      "Europe/Berlin": "DE",
      "Europe/Paris": "FR",
      "Europe/Rome": "IT",
      "Europe/Madrid": "ES",
      "Europe/Amsterdam": "NL",
      "Europe/Brussels": "BE",
      "Europe/Vienna": "AT",
      "Europe/Lisbon": "PT",
      "Europe/Dublin": "IE",
      "Europe/Helsinki": "FI",
      "Europe/Athens": "GR",
    };
    return tzMap[tz] || null;
  } catch {
    return null;
  }
}

/** Detects currency from IP geolocation or timezone fallback */
async function detectCurrency(): Promise<Currency> {
  try {
    const response = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code?.toUpperCase();
      if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
        return COUNTRY_TO_CURRENCY[countryCode];
      }
    }
  } catch {
    // IP detection failed, try timezone fallback
  }

  const tzCountry = getCountryFromTimezone();
  if (tzCountry && COUNTRY_TO_CURRENCY[tzCountry]) {
    return COUNTRY_TO_CURRENCY[tzCountry];
  }

  return DEFAULT_CURRENCY;
}

interface CurrencyProviderProps {
  children: ReactNode;
}

/**
 * Provides currency state with auto-detection.
 * Wrap pricing pages with this provider.
 */
export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    detectCurrency().then((detected) => {
      setCurrencyState(detected);
      setIsDetecting(false);
    });
  }, []);

  const formatPrice = useCallback(
    (price: number | null) => formatPriceUtil(price, currency),
    [currency]
  );

  const currencySymbol = CURRENCY_CONFIG[currency].symbol;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCurrencyState, formatPrice, currencySymbol, isDetecting }}>
      {children}
    </CurrencyContext.Provider>
  );
}

/** Hook to access currency context */
export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

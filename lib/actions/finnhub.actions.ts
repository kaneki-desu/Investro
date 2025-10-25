"use server";

import { getDateRange, validateArticle, formatArticle } from "@/lib/utils";
import { cache } from "react";
import { POPULAR_STOCK_SYMBOLS } from "../constants";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY!;

// Generic fetch helper
async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit = revalidateSeconds
    ? { next: { revalidate: revalidateSeconds }, cache: "force-cache" }
    : { cache: "no-store" };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }

  return (await res.json() )as T;
}

async function fetchPOSTJSON<T>(url: string,body: Record<string, string>,  revalidateSeconds?: number): Promise<T> {
  const options: RequestInit = revalidateSeconds
    ? { next: { revalidate: revalidateSeconds }, cache: "force-cache" }
    : { cache: "no-store" };

  const res = await fetch(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

export async function getNews(symbols?: string[]) {
  try {
    const { from, to } = getDateRange(5);
    const cleanSymbols = (symbols || []).map((s) => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s));
    const maxArticles = 6;
    // If user has watchlist symbols
    if (cleanSymbols && cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};
      await Promise.all(
        cleanSymbols.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${sym}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
            const articles = await fetchJSON<RawNewsArticle[]>(url, 300);
            perSymbolArticles[sym] = (articles || []).filter(validateArticle);
          } catch (e) {
            console.error(`Error fetching news for symbol ${sym}:`, e);
            perSymbolArticles[sym] = [];
          }
        }
        )
      )
      const collected: MarketNewsArticle[] = [];
      // Round-robin through max 6 symbols
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i];
          const list = perSymbolArticles[sym] || [];
          if (list.length == 0) continue;
          const article = list.shift()!;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }
      if(collected.length > 0) {
        collected.sort((a,b)=>((b.datetime || 0)- (a.datetime || 0) ))
        return collected.slice(0, maxArticles);
      }
    }
    // General market news fallback or when no symbols provided
    const generalUrl=`${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`;
    const general = await fetchJSON<RawNewsArticle[]>(generalUrl,300);

    const seen = new Set<string>();
    const unique : RawNewsArticle[]=[];
    for(const art of general) {
      if(!validateArticle(art))continue;
      const key =`${art.id}-${art.url}-${art.headline}`;
      if(!seen.has(key)) continue;
      seen.add(key);;
      unique.push(art);
      if(unique.length>=20) break;
    }
    const formatted = unique
        .slice(0, maxArticles)
        .map((a, idx) => formatArticle(a, false, undefined, idx));
    return formatted;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw new Error("Failed to fetch news");
  }
}

export const searchStocks=  cache(async(query: string) : Promise<StockWithWatchlistStatus[]>=> {
  try {
    if (!query.trim()) {
      const results = await Promise.all(
      POPULAR_STOCK_SYMBOLS.map(async (symbol) => {
        try {
          const url = `https://www.nseindia.com/api/search/autocomplete?q=${symbol}`;
          const res = await fetchJSON<{symbols:any[],mfsymbols:any[],search_content:any[]}>(url, 3600); // revalidate every hour
          const data:StockSearchNSEResult=res.symbols[0];
          return {
            symbol,
            name: data.symbol_info || "N/A",
            // logo: data.logo || null,
            type:  data.result_sub_type|| "Stock",
            exchange:  "BSE"
          };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return null;
        }
      })
    );

    // Filter out failed or empty entries
    return results.filter((x): x is StockWithWatchlistStatus => x !== null);
    }

    const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`;
    const data = await fetchPOSTJSON<{ results: any[] , stockList:any[], mfList:any[]}>(
      "https://www.etmoney.com/api/stocks/global-search",
      { query: query.trim() }
    );

      const results = (data?.stockList || [])
      .slice(0, 10)
      .map((item) => ({
        symbol: item.label,
        name: item.name,
        type: item.type || 'Stock',
        exchange: item.exchange || 'BSE',
        isInWatchlist: false,
      }));

    return results;
  } catch (error) {
    console.error("Error searching stocks:", error);
    return [];
  }
})
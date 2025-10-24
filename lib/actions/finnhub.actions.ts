"use server";

import { getDateRange, validateArticle, formatArticle } from "@/lib/utils";

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

export async function getNews(symbols?: string[]) {
  try {
    const { from, to } = getDateRange(5);
    const cleanSymbols = (symbols || []).map((s) => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s));
    const maxArticles = 6;
    // If user has watchlist symbols
    if (cleanSymbols && cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};
      let round = 0;

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

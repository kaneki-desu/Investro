"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { getAuth } from "@/lib/better-auth/auth";
import { fetchJSON, getNews } from "./finnhub.actions";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function fetchJSONNSE(symbol: string) {
  const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": `https://www.nseindia.com/get-quotes/equity?symbol=${symbol}`,
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
  };

  try {
    const res = await fetch(url, {
      headers,
      // Required for NSE since it sets anti-bot cookies
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error(`HTTP error ${res.status} for URL: ${url}`);

    return await res.json();
  } catch (err) {
    console.error("fetchJSONNSE error:", err);
    return null;
  }
}
export async function fetchStockRapidAPI(symbol: string) {
  const url = `https://indian-stock-exchange-api2.p.rapidapi.com/stock?name=${encodeURIComponent(symbol)}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
      "x-rapidapi-key": "4e04bf5c62mshdeceb72d4ab815bp1573ccjsnd7119667ce94",
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch ${symbol}`);
    }
    const data = await res.json();
    console.log("Stock data:", data);
    return data;
  } catch (error) {
    console.error("fetchStockRapidAPI error:", error);
    return null;
  }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection not established");
    // Step 1: Find the user by email (Better Auth user collection)
    const user = await db.collection("users").findOne({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || ' ');
    // Step 2: Query Watchlist collection
    const items = await Watchlist.find({ userId }, { symbol: 1, _id: 0 })
      .lean();

    return items.map((i) => String(i.symbol));
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
}

export async function isSymInWatchlist( symbol:  string) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectToDatabase();
    const found = await Watchlist.findOne(
      { userId: session.user.id, symbol },
    );

    return  Boolean(found);
  } catch (error) {
    console.error("Failed to add to watchlist:", error);
    throw error;
  }
}

export async function addToWatchlist({ symbol, company }: { symbol: string; company: string }) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectToDatabase();
    await Watchlist.findOneAndUpdate(
      { userId: session.user.id, symbol },
      { 
        userId: session.user.id,
        symbol,
        company,
        addedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    // revalidatePath('/watchlist');
    return { success: true };
  } catch (error) {
    console.error("Failed to add to watchlist:", error);
    throw error;
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectToDatabase();
    await Watchlist.findOneAndDelete({
      userId: session.user.id,
      symbol
    });

    // revalidatePath('/watchlist');
    return { success: true };
  } catch (error) {
    console.error("Failed to remove from watchlist:", error);
    throw error;
  }
}

export async function getUserWatchlist() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user?.id) return { items: [], news: [] };

    await connectToDatabase();
    const watchlist = await Watchlist.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();

    // Get news for watchlist symbols
    const symbols = watchlist.map(item => item.symbol);
    const news = await getNews(symbols);

    return {
      items: symbols,
      news
    };
  } catch (error) {
    console.error("Failed to get watchlist:", error);
    return { items: [], news: [] };
  }
}
type CacheEntry = {
  data: StockWithData;
  timestamp: number;
};

const CACHE: Record<string, CacheEntry> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getWatchListInfo(symbols: string[]): Promise<StockWithData[] | undefined | null> {
  try {
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      console.error("Was not able to get watchlist info: symbols undefined or empty");
      return;
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");

    return await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const now = Date.now();

          // Return cached data if valid
          if (CACHE[symbol] && now - CACHE[symbol].timestamp < CACHE_TTL) {
            console.log("Returning cached data for:", symbol);
            return CACHE[symbol].data;
          }

          console.log("Fetching:", symbol);
          const res = await fetchStockRapidAPI(symbol);

          const stockData: StockWithData = {
            userId: session.user.id,
            symbol: symbol,
            company: res?.companyName || symbol,
            industryInfo: res?.industry || 'N/A',
            currentPrice: res?.currentPrice?.BSE || null,
            changePercent: res?.percentChange || null,
            weekHigh: res?.keyMetrics?.priceandVolume.find(item => item.key === "52WeekHigh")?.value || null,
            weekLow: res?.keyMetrics?.priceandVolume.find(item => item.key === "52WeekLow")?.value || null,
            marketCap: res?.keyMetrics?.priceandVolume.find(item => item.key === "marketCap")?.value || null,
            peRatio: res?.keyMetrics?.valuation.find(item => item.key === "pPerEBasicExcludingExtraordinaryItemsTTM")?.value || null,
            recentNews: res?.recentNews
          };

          // Cache the result
          CACHE[symbol] = { data: stockData, timestamp: now };

          return stockData;
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return null;
        }
      })
    );

  } catch (error) {
    console.error("Was not able to get watchlist info:", error);
    return;
  }
}

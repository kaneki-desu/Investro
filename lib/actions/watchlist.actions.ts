"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { auth } from "@/lib/better-auth/auth";

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection not established");
    // Step 1: Find the user by email (Better Auth user collection)
    const user = await db.collection("users").findOne({ email });
    if (!user) return [];

    const userId= (user.id as string) || String(user._id || ' ');
    // Step 2: Query Watchlist collection
    const items = await Watchlist.find({ userId },{ symbol: 1, _id: 0 })
      .lean();

    return items.map((i) => String(i.symbol));
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
}

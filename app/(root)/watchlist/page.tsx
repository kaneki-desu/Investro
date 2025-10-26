// REMOVED: 'use client'
import { getUserWatchlist , getWatchListInfo} from "@/lib/actions/watchlist.actions";
// Assuming this is the correct path// Assuming you have a types file
import { Suspense } from "react"; // REMOVED: useState
import WatchlistTable from "@/components/WatchlistTable";
import WatchlistNews from "@/components/WatchlistNews";

// This is now a React Server Component
export default async function WatchlistPage() {
  console.log('fetching watchlist');
  
  // 1. Fetch watchlist symbols
  const { items: watchlistSym } = await getUserWatchlist();
  console.log(watchlistSym);

  // 2. Fetch detailed info for all symbols on the server
  const watchlistData = await getWatchListInfo(watchlistSym);

  // 3. Process data to create newsMap on the server
  const newsMap: Record<string, MarketNewsArticle[]> = {};
  if (watchlistData) {
    for (const stock of watchlistData) {
      // Ensure stock and recentNews are valid before adding
      if (stock && stock.symbol && stock.recentNews) {
        // Assuming stock.recentNews is already MarketNewsArticle[]
        newsMap[stock.symbol] = stock.recentNews; 
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-100">My Watchlist</h1>
        <p className="text-gray-400">Track your favorite stocks and stay updated with the latest news.</p>
      </div>

      <div className="flex flex-col justify-center items-center gap-8">
        <div>
          <Suspense fallback={<div>Loading watchlist...</div>}>
            {/* Pass the full watchlistData down.
              WatchlistTable now just renders this data.
            */}
            <WatchlistTable watchlistData={watchlistData || []} />
          </Suspense>
        </div>
        
        <div>
          <Suspense fallback={<div>Loading news...</div>}>
            {/* Pass the server-generated newsMap directly */}
            <WatchlistNews newsMap={newsMap} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
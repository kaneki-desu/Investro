
import { getUserWatchlist } from "@/lib/actions/watchlist.actions"
import { Suspense } from "react"
import WatchlistTable from "@/components/WatchlistTable"
import WatchlistNews from "@/components/WatchlistNews"

export default async function WatchlistPage() {
  const { items: watchlistSym, news } = await getUserWatchlist();
  console.log(watchlistSym)
  return (
    <main className="flex min-h-screen flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-100">My Watchlist</h1>
        <p className="text-gray-400">Track your favorite stocks and stay updated with the latest news.</p>
      </div>

      <div className="flex flex-col justify-center items-center gap-8">
        <div >
          <Suspense fallback={<div>Loading watchlist...</div>}>
            <WatchlistTable watchlistSym={watchlistSym} />
          </Suspense>
        </div>
        
        <div>
          <Suspense fallback={<div>Loading news...</div>}>
            <WatchlistNews news={news} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
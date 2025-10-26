'use client';

import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import WatchlistButton from "./WatchListButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { getWatchListInfo } from "@/lib/actions/watchlist.actions";

export default function WatchlistTable({ watchlistSym }: { watchlistSym: string[] }) {
  const [removeSymbol, setRemoveSymbol] = useState<string | null>(null);
  const [watchlist, setWatchList] = useState<StockWithData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showAlert = searchParams.get('showAlert') === 'true';

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const watchlistSy = await getWatchListInfo(watchlistSym);
        setWatchList(watchlistSy || []);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [watchlistSym]);

  const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
    if (!isAdded) setRemoveSymbol(symbol);
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-8 text-center flex flex-col items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 mb-4 text-yellow-400" />
        <p className="text-gray-400">Loading your watchlist...</p>
      </div>
    );
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Your watchlist is empty</h3>
        <p className="text-gray-400 mb-6">
          Start adding stocks to track their performance and get personalized alerts.
        </p>
        <Button onClick={() => router.push('/')}>Browse Stocks</Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-700 text-gray-400 hidden sm:table-header-group">
          <tr>
            {WATCHLIST_TABLE_HEADER.map((header, index) => (
              <th key={index} className="px-4 py-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="flex flex-col gap-4 sm:table-row-group">
          {watchlist.map((stock: StockWithData) => (
            <tr
              key={stock.symbol}
              className="bg-gray-800/50 border border-gray-700 rounded-lg sm:table-row flex flex-col sm:flex-row"
            >
              {/* Mobile: label + value stacked */}
              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="font-semibold sm:hidden">Company:</span>
                <Link href={`/stocks/${stock.symbol}`} className="flex items-center gap-2 hover:text-blue-500">
                  <TrendingUp className="h-4 w-4" />
                  {stock.company}
                </Link>
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="sm:hidden font-semibold">Industry:</span> {stock.industryInfo}
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="sm:hidden font-semibold">Price:</span> Rs.{stock.currentPrice || 'N/A'}
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="sm:hidden font-semibold">Change %:</span>
                <span className={stock.changePercent && stock.changePercent > 0 ? 'text-green-400' : 'text-red-400'}>
                  {stock.changePercent || 'N/A'} %
                </span>
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="sm:hidden font-semibold">Market Cap:</span> {stock.marketCap || 'N/A'} Cr.
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="sm:hidden font-semibold">P/E:</span> {stock.peRatio || 'N/A'}
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="sm:hidden font-semibold">52W High:</span> Rs.{stock.weekHigh || 'N/A'}
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <span className="sm:hidden font-semibold">52W Low:</span> Rs.{stock.weekLow || 'N/A'}
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/watchlist?symbol=${stock.symbol}&showAlert=true`)}
                >
                  Set Alert
                </Button>
              </td>

              <td className="px-4 py-2 flex justify-between sm:table-cell">
                <WatchlistButton
                  symbol={stock.symbol}
                  company={stock.company}
                  isInWatchlist={true}
                  showTrashIcon={true}
                  onWatchlistChange={handleWatchlistChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

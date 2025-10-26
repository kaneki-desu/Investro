'use client'

import { useState, useEffect} from 'react'
import { CommandInput, CommandList, CommandEmpty,  CommandDialog } from "@/components/ui/command"
import { Button } from './ui/button'
import { Loader2, Star, ToggleRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'
import { searchStocks } from '@/lib/actions/finnhub.actions'
import { addToWatchlist,  removeFromWatchlist } from '@/lib/actions/watchlist.actions'
import { toast } from 'sonner'
import { useUser } from '@/context/UserContext'

export default function SearchCommand({renderAs='button', label='Add Stock', initialStocks}: SearchCommandProps ) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks)
  const isSearchMode = !! searchTerm.trim();
  const displayStocks = isSearchMode? stocks: stocks?.slice(0,10) ;
  const { watchlist, toggleStock } = useUser();
  useEffect(() => {
    console.log(watchlist);
    setStocks(prev =>
      prev.map(stock => ({
        ...stock,
        isInWatchlist: watchlist.includes(stock.symbol)
      }))
    );
  }, [watchlist]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleWatchlistToggle = async (stock: StockWithWatchlistStatus) => {
    try {
      if (stock.isInWatchlist) {
        toggleStock(stock.symbol);
      } else {
        toggleStock(stock.symbol,stock.name);
      }
      // Update the stock's watchlist status in the local state
      setStocks(prev => prev.map(s => 
        s.symbol === stock.symbol 
          ? { ...s, isInWatchlist: !s.isInWatchlist }
          : s
      ));
    } catch (error) {
      toast.error("Failed to update watchlist");
      console.error("Watchlist update error:", error);
    }
  };

  const handleSearch = async()=>{
    if(!isSearchMode)return setStocks(initialStocks);
    setLoading(true);
    try {
      const results:StockWithWatchlistStatus[]= await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch (error) {
      setStocks([]);
    }finally{
      setLoading(false);
    }
  }

  const debouncedSearch = useDebounce(handleSearch,300);
  useEffect(()=>{
    debouncedSearch();
  },[searchTerm])

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks);
  }

  return (
    <>
        {renderAs ==='text' ? (<span onClick={()=> setOpen(true)} className='search-text'>{label}</span>) : (
            <Button onClick={()=> setOpen(true)} className='search-button' >
                {label}
            </Button>)}
        <CommandDialog open={open} onOpenChange={setOpen} className='search-dialog'>
            <div className="search-field">
                <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..."
                className='search-input'
                />
                {loading && <Loader2 className="search-loader" />}
            </div>
          
          <CommandList className='search-list'>
            {loading ?(
                <CommandEmpty className='search-list-empty'>Loading stocks...</CommandEmpty>
            ): (displayStocks.length ===0 ? (
                <div className="search-list-indicator">
                    {isSearchMode ? 'No stocks found.' : 'No search available.'}
                </div>
            ) : (
                <ul>
                    <div className="search-count">
                    {isSearchMode ? 'Search Results' : 'Popular Stocks'}
                    {` (${displayStocks?.length || 0})`}
                </div>
                {displayStocks?.map((stock,i)=>(
                    <li key={stock.symbol} className='search-item'>
                        <Link 
                            href={`/stocks/${stock.symbol}`}
                            onClick={handleSelectStock}
                            className='search-item-link'
                        >
                            <TrendingUp className='h-4 w-4 text-gray-500' />
                            <div className="flex-1">
                              <div className="search-item-name">{stock.name}</div>
                              <div className="text-sm text-gray-500">
                                  {stock.symbol} | {stock.exchange} | {stock.type} 
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleWatchlistToggle(stock);
                              }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            >
                              <Star className={stock.isInWatchlist? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                            </button>
                        </Link>
                    </li>
                ))}
                </ul>
                
            ))}
            
            {/* <CommandItem onSelect={() => handleSelectStock('AAPL')}>AAPL</CommandItem>
            <CommandItem onSelect={() => handleSelectStock('GOOGL')}>GOOGL</CommandItem>
            <CommandItem onSelect={() => handleSelectStock('MSFT')}>MSFT</CommandItem> */}
          </CommandList>
        </CommandDialog>
    </>
  )
}

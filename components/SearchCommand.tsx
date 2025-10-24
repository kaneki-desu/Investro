'use client'

import { useState, useEffect, use } from 'react'
import { CommandInput, CommandList, CommandEmpty, CommandItem, CommandDialog } from "@/components/ui/command"
import { Button } from './ui/button'
import { Loader2, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'
import { searchStocks } from '@/lib/actions/finnhub.actions'

export default function SearchCommand({renderAs='button', label='Add Stock', initialStocks}: SearchCommandProps ) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks)

  const isSearchMode = !! searchTerm.trim();
  const displayStocks = isSearchMode? stocks: stocks?.slice(0,10) ;

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
                            {/* <Star /> */}
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

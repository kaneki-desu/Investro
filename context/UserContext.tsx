// context/UserContext.tsx
'use client';
import { addToWatchlist, getUserWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type UserContextType = {
  watchlist: string[];
  setWatchlist: (list: string[]) => void;
  toggleStock: (symbol: string , company?:string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load watchlist on client-side
  useEffect(() => {
    async function fetchWatchlist() {
      const res = await getUserWatchlist(); // your Next.js API route
      const data =  res.items;
      setWatchlist(data);
    }
    fetchWatchlist();
  }, []);

  const toggleStock = async (symbol: string, company?: string) => {
    let updated: string[];

    if (watchlist.includes(symbol)) {
      // Remove locally
      updated = watchlist.filter(s => s !== symbol);    
      // Update server
      await removeFromWatchlist(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } else {
      // Add locally
      updated = [...watchlist, symbol];
      // Update server
      if(company)await addToWatchlist({symbol, company});
      toast.success(`${symbol} added from watchlist`);
    }
    // Update state
    console.log("Updated",updated);
    setWatchlist(updated);
    // Call server to persist change
  };

  return (
    <UserContext.Provider value={{ watchlist, setWatchlist, toggleStock }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

"use client";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import React, { useMemo, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { set } from "mongoose";
import { useUser } from "@/context/UserContext";

// Minimal WatchlistButton implementation to satisfy page requirements.
// This component focuses on UI contract only. It toggles local state and
// calls onWatchlistChange if provided. Styling hooks match globals.css.

const WatchlistButton = ({
  symbol,
  company,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const { watchlist, toggleStock } = useUser();

  // Instead of local state, derive `added` from global watchlist
  const added = watchlist.includes(symbol);

  const [alertOpen, setAlertOpen] = useState(false);

  const handleClick = async () => {
    if (!added) {
      // Add to watchlist
      await toggleStock(symbol, company);
      onWatchlistChange?.(symbol, true);
    } else {
      // Show alert for removal if using button with alert
      setAlertOpen(true);
    }
  };

  const handleRemoveConfirm = async () => {
    await toggleStock(symbol);
    onWatchlistChange?.(symbol, false);
    setAlertOpen(false);
  };

  // Determine label dynamically
  const label = type === "icon" ? "" : added ? "Remove from Watchlist" : "Add to Watchlist";

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? "#FACC15" : "none"}
          stroke="#FACC15"
          strokeWidth="1.5"
          className="watchlist-star"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  return (
    <>
      <button className={`watchlist-btn flex p-2 ${added ? "watchlist-remove" : ""}`} onClick={handleClick}>
        {showTrashIcon && added ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
          </svg>
        ) : null}
        <span>{label}</span>
      </button>

      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Watchlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {symbol} from your watchlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <button onClick={handleRemoveConfirm}>Remove</button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WatchlistButton;

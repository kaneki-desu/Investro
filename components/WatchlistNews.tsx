'use client';

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function WatchlistNews({ news = [] }: WatchlistNewsProps) {
  if (!news || news.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Market News</h3>
        <p className="text-gray-400">No news available for your watchlist stocks.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Market News</h3>
      <div className="space-y-4">
        {news.map((article) => (
          <article key={article.id} className="border-b border-gray-700 pb-4 last:border-0">
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <h4 className="font-medium mb-2 line-clamp-2">{article.headline}</h4>
            </Link>
            <p className="text-sm text-gray-400 line-clamp-2 mb-2">
              {article.summary}
            </p>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>{article.source}</span>
              <span>•</span>
              <time>
                {formatDistanceToNow(new Date(article.datetime * 1000), {
                  addSuffix: true,
                })}
              </time>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
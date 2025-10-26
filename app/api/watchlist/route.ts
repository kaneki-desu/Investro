// app/api/watchlist/route.ts
import { NextResponse } from 'next/server';
import { getUserWatchlist } from '@/lib/actions/watchlist.actions';

export async function GET() {
  const data = await getUserWatchlist();
  return NextResponse.json(data);
}

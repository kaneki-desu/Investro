'use client';
import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    title?:string;
    scriptUrl:string;
    config: Record<string, unknown>;
    height?: Number;
    className?: string;
}
const TradingViewWidget = ({title, scriptUrl, config, height =600, className}: TradingViewWidgetProps) => {
  const containerRef = useTradingViewWidget(scriptUrl, config, height );

  return (
    <div className="w-full">
      {title && <h2 className="text-lg font-semibold mb-5 text-gray-100">{title}</h2>}
      <div className={cn("tradingview-widget-container", className) }ref={containerRef}>
        <div className="tradingview-widget-container__widget" style={{ height:`${height}`, width: "100%" }} />
      </div>
    </div>
    
  );
}

export default memo(TradingViewWidget);

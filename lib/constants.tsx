// Navigation (Unchanged)
export const NAV_ITEMS = [
    { href: '/', label: 'Dashboard' },
    { href: '/search', label: 'Search' },
    { href: '/watchlist', label: 'Watchlist' },
];

// Sign-up form select options (Unchanged)
export const INVESTMENT_GOALS = [
    { value: 'Growth', label: 'Growth' },
    { value: 'Income', label: 'Income' },
    { value: 'Balanced', label: 'Balanced' },
    { value: 'Conservative', label: 'Conservative' },
];

export const RISK_TOLERANCE_OPTIONS = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
];

export const PREFERRED_INDUSTRIES = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Consumer Goods', label: 'Consumer Goods' },
];

// Alert options (Unchanged)
export const ALERT_TYPE_OPTIONS = [
    { value: 'upper', label: 'Upper' },
    { value: 'lower', label: 'Lower' },
];

export const CONDITION_OPTIONS = [
    { value: 'greater', label: 'Greater than (>)' },
    { value: 'less', label: 'Less than (<)' },
];

// --- TradingView Charts (Converted to BSE) ---

export const MARKET_OVERVIEW_WIDGET_CONFIG = {
    colorTheme: 'dark',
    dateRange: '12M',
    locale: 'in', // Changed to India
    largeChartUrl: '',
    isTransparent: true,
    showFloatingTooltip: true,
    plotLineColorGrowing: '#0FEDBE',
    plotLineColorFalling: '#0FEDBE',
    gridLineColor: 'rgba(240, 243, 250, 0)',
    scaleFontColor: '#DBDBDB',
    belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
    belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
    belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
    belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
    symbolActiveColor: 'rgba(15, 237, 190, 0.05)',
    tabs: [
        {
            title: 'Financial',
            symbols: [
                { s: 'BSE:HDFCBANK', d: 'HDFC Bank' },
                { s: 'BSE:ICICIBANK', d: 'ICICI Bank' },
                { s: 'BSE:SBIN', d: 'State Bank of India' },
                { s: 'BSE:KOTAKBANK', d: 'Kotak Mahindra Bank' },
                { s: 'BSE:AXISBANK', d: 'Axis Bank' },
                { s: 'BSE:BAJFINANCE', d: 'Bajaj Finance' },
            ],
        },
        {
            title: 'Technology',
            symbols: [
                { s: 'BSE:TCS', d: 'Tata Consultancy Services' },
                { s: 'BSE:INFY', d: 'Infosys' },
                { s: 'BSE:HCLTECH', d: 'HCL Technologies' },
                { s: 'BSE:WIPRO', d: 'Wipro' },
                { s: 'BSE:TECHM', d: 'Tech Mahindra' },
                { s: 'BSE:LTIM', d: 'LTIMindtree' },
            ],
        },
        {
            title: 'Conglomerates & FMCG',
            symbols: [
                { s: 'BSE:RELIANCE', d: 'Reliance Industries' },
                { s: 'BSE:ITC', d: 'ITC Ltd' },
                { s: 'BSE:HINDUNILVR', d: 'Hindustan Unilever' },
                { s: 'BSE:TATAMOTORS', d: 'Tata Motors' },
                { s: 'BSE:BHARTIARTL', d: 'Bharti Airtel' },
                { s: 'BSE:ASIANPAINT', d: 'Asian Paints' },
            ],
        },
    ],
    support_host: 'https://www.tradingview.com',
    backgroundColor: '#141414',
    width: '100%',
    height: 600,
    showSymbolLogo: true,
    showChart: true,
};

export const HEATMAP_WIDGET_CONFIG = {
    dataSource: 'SENSEX', // Changed from SPX500 to SENSEX
    blockSize: 'market_cap_basic',
    blockColor: 'change',
    grouping: 'sector',
    isTransparent: true,
    locale: 'in', // Changed to India
    symbolUrl: '',
    colorTheme: 'dark',
    exchanges: [],
    hasTopBar: false,
    isDataSetEnabled: false,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
    width: '100%',
    height: '600',
};

export const TOP_STORIES_WIDGET_CONFIG = {
    displayMode: 'regular',
    feedMode: 'market',
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'in', // Changed to India
    market: 'india', // Changed from stock to india
    width: '100%',
    height: '600',
};

export const MARKET_DATA_WIDGET_CONFIG = {
    title: 'Stocks',
    width: '100%',
    height: 600,
    locale: 'in', // Changed to India
    showSymbolLogo: true,
    colorTheme: 'dark',
    isTransparent: false,
    backgroundColor: '#0F0F0F',
    symbolsGroups: [
        {
            name: 'Financial',
            symbols: [
                { name: 'BSE:HDFCBANK', displayName: 'HDFC Bank' },
                { name: 'BSE:ICICIBANK', displayName: 'ICICI Bank' },
                { name: 'BSE:SBIN', displayName: 'State Bank of India' },
                { name: 'BSE:KOTAKBANK', displayName: 'Kotak Mahindra Bank' },
                { name: 'BSE:AXISBANK', displayName: 'Axis Bank' },
                { name: 'BSE:BAJFINANCE', displayName: 'Bajaj Finance' },
            ],
        },
        {
            name: 'Technology',
            symbols: [
                { name: 'BSE:TCS', displayName: 'TCS' },
                { name: 'BSE:INFY', displayName: 'Infosys' },
                { name: 'BSE:HCLTECH', displayName: 'HCL Tech' },
                { name: 'BSE:WIPRO', displayName: 'Wipro' },
                { name: 'BSE:TECHM', displayName: 'Tech Mahindra' },
                { name: 'BSE:LTIM', displayName: 'LTIMindtree' },
            ],
        },
        {
            name: 'Auto & Pharma',
            symbols: [
                { name: 'BSE:MARUTI', displayName: 'Maruti Suzuki' },
                { name: 'BSE:TATAMOTORS', displayName: 'Tata Motors' },
                { name: 'BSE:M_M', displayName: 'Mahindra & Mahindra' },
                { name: 'BSE:SUNPHARMA', displayName: 'Sun Pharma' },
                { name: 'BSE:CIPLA', displayName: 'Cipla' },
                { name: 'BSE:DRREDDY', displayName: "Dr. Reddy's Labs" },
            ],
        },
    ],
};

// --- Widget Config Functions (Locale updated) ---

export const SYMBOL_INFO_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'in', // Changed to India
    width: '100%',
    height: 170,
});

export const CANDLE_CHART_WIDGET_CONFIG = (symbol: string) => ({
    allow_symbol_change: false,
    calendar: false,
    details: true,
    hide_side_toolbar: true,
    hide_top_toolbar: false,
    hide_legend: false,
    hide_volume: false,
    hotlist: false,
    interval: 'D',
    locale: 'in', // Changed to India
    save_image: false,
    style: 1,
    symbol: symbol.toUpperCase(),
    theme: 'dark',
    timezone: 'Asia/Kolkata', // Changed to Indian Timezone
    backgroundColor: '#141414',
    gridColor: '#141414',
    watchlist: [],
    withdateranges: false,
    compareSymbols: [],
    studies: [],
    width: '100%',
    height: 600,
});

export const BASELINE_WIDGET_CONFIG = (symbol: string) => ({
    allow_symbol_change: false,
    calendar: false,
    details: false,
    hide_side_toolbar: true,
    hide_top_toolbar: false,
    hide_legend: false,
    hide_volume: false,
    hotlist: false,
    interval: 'D',
    locale: 'in', // Changed to India
    save_image: false,
    style: 10,
    symbol: symbol.toUpperCase(),
    theme: 'dark',
    timezone: 'Asia/Kolkata', // Changed to Indian Timezone
    backgroundColor: '#141414',
    gridColor: '#141414',
    watchlist: [],
    withdateranges: false,
    compareSymbols: [],
    studies: [],
    width: '100%',
    height: 600,
});

export const TECHNICAL_ANALYSIS_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: 'true',
    locale: 'in', // Changed to India
    width: '100%',
    height: 400,
    interval: '1h',
    largeChartUrl: '',
});

export const COMPANY_PROFILE_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: 'true',
    locale: 'in', // Changed to India
    width: '100%',
    height: 440,
});

export const COMPANY_FINANCIALS_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: 'true',
    locale: 'in', // Changed to India
    width: '100%',
    height: 464,
    displayMode: 'regular',
    largeChartUrl: '',
});

// --- Data Lists (Converted to BSE) ---

export const POPULAR_STOCK_SYMBOLS = [
    // SENSEX 30 Majors
    'RELIANCE',
    'TCS',
    'HDFCBANK',
    'ICICIBANK',
    'INFY',
    'HINDUNILVR',
    'BHARTIARTL',
    'SBIN',
    'ITC',
    'LTIM', // LTIMindtree (replaces L&T in some contexts)
    'BAJFINANCE',
    'KOTAKBANK',
    'HCLTECH',
    'AXISBANK',
    'ASIANPAINT',
    'MARUTI',
    'M_M', // Mahindra & Mahindra
    'SUNPHARMA',
    'TITAN',
    'WIPRO',
    'NESTLEIND',
    'ULTRACEMCO',
    'POWERGRID',
    'NTPC',
    'TATAMOTORS',
    'TATASTEEL',
    'JSWSTEEL',
    'BAJAJFINSV',
    'INDUSINDBK',
    'TECHM',

    // Other Popular Stocks
    'DMART',
    'ADANIENT',
    'ADANIPORTS',
    'PIDILITIND',
    'BAJAJ-AUTO',
    'BRITANNIA',
    'CIPLA',
    'COALINDIA',
    'DRREDDY',
    'EICHERMOT',
    'GRASIM',
    'HEROMOTOCO',
    'HINDALCO',
    'ONGC',
    'SBILIFE',
    'HDFCLIFE',
    'ZOMATO',
    'PAYTM', // One 97 Communications
    'POLICYBZR', // PB Fintech
];


// Generic Strings (Unchanged)
export const NO_MARKET_NEWS =
    '<p class="mobile-text" style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;">No market news available today. Please check back tomorrow.</p>';

export const WATCHLIST_TABLE_HEADER = [
    'Company',
    'Industry',
    'Price ',
    'Change %',
    'Market Cap',
    'P/E Ratio',
    'Week High',
    'Week Low',
    'Alert',
    'Action',
];
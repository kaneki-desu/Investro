declare global {
    type SignInFormData = {
        email: string;
        password: string;
    };

    type SignUpFormData = {
        fullName: string;
        email: string;
        password: string;
        country: string;
        investmentGoals: string;
        riskTolerance: string;
        preferredIndustry: string;
    };

    type CountrySelectProps = {
        name: string;
        label: string;
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    };

    type Option = {
        value: string;
        label: string;
    };

    type SelectFieldProps = {
        name: string;
        label: string;
        placeholder: string;
        options: readonly Option[];
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FooterLinkProps = {
        text: string;
        linkText: string;
        href: string;
    };

    type SearchCommandProps = {
        renderAs?: 'button' | 'text';
        label?: string;
        initialStocks: StockWithWatchlistStatus[];
    };

    type WelcomeEmailData = {
        email: string;
        name: string;
        intro: string;
    };

    type User = {
        id: string;
        name: string;
        email: string;
    };

    type Stock = {
        symbol: string;
        name: string;
        exchange: string;
        type: string;
    };

    type StockWithWatchlistStatus = Stock & {
        isInWatchlist: boolean;
    };

    type SymbolSuggest = {
      input: string;
      weight: number;
    };

    type StockSearchNSEResult = {
      symbol: string;
      symbol_info: string;
      symbol_suggest: SymbolSuggest[];
      result_type: string;        // e.g., 'symbol'
      result_sub_type: string;    // e.g., 'equity'
      activeSeries: string[];     // e.g., ['EQ', 'T0']
      listing_date: string;       // ISO date string
      url: string;                // relative link
    };

    type FinnhubSearchResult = {
        symbol: string;
        description: string;
        displaySymbol?: string;
        exchange: string;
        type: string;
    };

    type FinnhubSearchResponse = {
        count: number;
        result: FinnhubSearchResult[];
    };

    type StockDetailsPageProps = {
        params: Promise<{
            symbol: string;
        }>;
    };

    type WatchlistButtonProps = {
        symbol: string;
        company: string;
        isInWatchlist: boolean;
        showTrashIcon?: boolean;
        type?: 'button' | 'icon';
        onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
    };

    type QuoteData = {
        c?: number;
        dp?: number;
    };

    type ProfileData = {
        name?: string;
        marketCapitalization?: number;
    };

    type FinancialsData = {
        metric?: { [key: string]: number };
    };

    type SelectedStock = {
        symbol: string;
        company: string;
        currentPrice?: number;
    };

    type WatchlistTableProps = {
        watchlistSym: StockWithData[];
    };

    type StockWithData = {
        userId: string;
        symbol: string;
        company: string;
        industryInfo: string;
        currentPrice?: number;
        changePercent?: number;
        weekHigh?: number;
        weekLow?: number;
        marketCap?: number;
        peRatio?: number;
        recentNews?: object[];
    };

    type AlertsListProps = {
        alertData: Alert[] | undefined;
    };

    type MarketNewsArticle = {
      id: number | string;
      headline: string;
      intro: string;
      date: string | number;
      url: string;
      section: string;
      image?: string;
      byline?: string;
      premiumStory?: string;
      timeToRead?: string;
    };

    interface WatchlistNewsProps {
      newsMap: Record<string, MarketNewsArticle[]>;
    }

    type SearchCommandProps = {
        open?: boolean;
        setOpen?: (open: boolean) => void;
        renderAs?: 'button' | 'text';
        buttonLabel?: string;
        buttonVariant?: 'primary' | 'secondary';
        className?: string;
    };

    type AlertData = {
        symbol: string;
        company: string;
        alertName: string;
        alertType: 'upper' | 'lower';
        threshold: string;
    };

    type AlertModalProps = {
        alertId?: string;
        alertData?: AlertData;
        action?: string;
        open: boolean;
        setOpen: (open: boolean) => void;
    };

    type RawNewsArticle = {
        id: number;
        headline?: string;
        summary?: string;
        source?: string;
        url?: string;
        datetime?: number;
        image?: string;
        category?: string;
        related?: string;
    };

    type Alert = {
        id: string;
        symbol: string;
        company: string;
        alertName: string;
        currentPrice: number;
        alertType: 'upper' | 'lower';
        threshold: number;
        changePercent?: number;
    };
    type Article = {
      id: string | number | null;
      url: string | null;
      headline: string | null;
      source: string | null;
      datetime: string; // ISO
      summary?: string | null;
      related?: string | null;
    };

}

export {};
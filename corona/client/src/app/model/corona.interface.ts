export interface CoronaTotalRecord {
    // country: string;
    deaths?: number;
    cases: number;
    active?: number;
    recovered?: number;
}
export interface CoronaCountryRecord extends CoronaTotalRecord {
    country: string;

    countryInfo?: { iso2: string };
}

export interface CoronaHistoricalAll {
    cases: { [date: string]: number };
    deaths: { [date: string]: number };
    recovered: { [date: string]: number };
}

export interface CoronaHistoricalCountry {
    country: string;
    timeline: CoronaHistoricalAll;
}
export interface CoronaHistoricalMapped {
    date: string;
    cases: number;
    deaths: number;
    recovered: number;
}

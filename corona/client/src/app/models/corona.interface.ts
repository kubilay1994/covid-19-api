import { TimelineRecord } from './timelineRecord';

export interface CoronaHistoricalRecord {
    id: string;
    country: string;
    timeline: TimelineRecord[];
}

export interface CoronaRecord {
    id: string;
    country: string;
    cases: number;
    deaths: number;
    recovered: number;
}

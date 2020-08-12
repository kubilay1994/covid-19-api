import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import {
    CoronaHistoricalRecord,
    CoronaRecord,
} from '../models/corona.interface';

@Injectable({
    providedIn: 'root',
})
export class CoronaDataService {
    coronaCountries = new BehaviorSubject<CoronaRecord[]>([]);
    coronaTotal = new BehaviorSubject<CoronaHistoricalRecord>(null);

    constructor(private http: HttpClient) {
        this.fetchWorldRecord().subscribe(data => {
            this.coronaTotal.next(data);
        });
        this.fetchCoronaData();
    }

    private fetchCoronaData() {
        this.fetchAllHistoricalRecords(1).subscribe(data => {
            const mappedData = data.map(el => {
                return {
                    id: el.id,
                    country: el.country,
                    ...el.timeline[0],
                };
            });
            this.coronaCountries.next(
                mappedData.sort((a, b) => b.cases - a.cases)
            );
        });
    }

    fetchWorldRecord(timelineLimit: number = 360) {
        let params = new HttpParams({
            fromObject: {
                timelineLimit: timelineLimit.toString(),
            },
        });
        return this.http.get<CoronaHistoricalRecord>('api/corona/all', {
            params,
        });
    }

    fetchAllHistoricalRecords(timelineLimit: number = 360) {
        let params = new HttpParams({
            fromObject: {
                timelineLimit: timelineLimit.toString(),
            },
        });
        return this.http.get<CoronaHistoricalRecord[]>(`api/corona/country`, {
            params,
        });
    }

    fetchCountryHistoricalRecord(
        countryId: string,
        timelineLimit: number = 360
    ) {
        let params = new HttpParams({
            fromObject: {
                timelineLimit: timelineLimit.toString(),
            },
        });

        return this.http.get<CoronaHistoricalRecord>(
            `api/corona/country/${countryId}`,
            {
                params,
            }
        );
    }
}

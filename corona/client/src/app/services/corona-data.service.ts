import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CoronaCountryRecord,
    CoronaTotalRecord,
    CoronaHistoricalAll,
    CoronaHistoricalMapped,
    CoronaHistoricalCountry,
} from '../model/corona.interface';

@Injectable({
    providedIn: 'root',
})
export class CoronaDataService {
    coronaCountries = new BehaviorSubject<CoronaCountryRecord[]>([]);
    coronaTotal = new BehaviorSubject<CoronaTotalRecord>({ cases: 0 });

    coronaHistorical = new BehaviorSubject<CoronaHistoricalMapped[]>([]);
    // coronaHistorical: CoronaHistoricalMapped[];

    constructor(private http: HttpClient) {
        this.fetchCountryHistoricalData();
        this.fetchCoronaData();
    }

    private fetchCoronaData() {
        this.http
            .get<CoronaCountryRecord[]>(
                'https://disease.sh/v3/covid-19/countries/?sort=cases'
            )
            .subscribe((data) => {
                this.coronaCountries.next(data);
            });
        this.http
            .get<CoronaTotalRecord>('https://disease.sh/v3/covid-19/all')
            .subscribe((data) => {
                this.coronaTotal.next(data);
            });
    }

    fetchCountryHistoricalData(countryId?: string) {
        if (countryId) {
            this.http
                .get<CoronaHistoricalCountry>(
                    `https://disease.sh/v3/covid-19/historical/${countryId}`
                )
                .pipe(
                    map((data) => {
                        let keys = Object.keys(data.timeline.cases);
                        let mappedData: CoronaHistoricalMapped[] = [];
                        for (let date of keys) {
                            mappedData.push({
                                date,
                                cases: data.timeline.cases[date],
                                deaths: data.timeline.deaths[date],
                                recovered: data.timeline.recovered[date],
                            });
                        }
                        return mappedData;
                    })
                )
                .subscribe((data) => {
                    console.log(data);
                    this.coronaHistorical.next(data);
                    // this.coronaHistorical = data;
                });
        } else {
            this.http
                .get<CoronaHistoricalAll>(
                    'https://disease.sh/v3/covid-19/historical/all'
                )
                .pipe(
                    map((data) => {
                        let mappedData: CoronaHistoricalMapped[] = [];
                        let keys = Object.keys(data.cases);
                        for (let date of keys) {
                            mappedData.push({
                                date,
                                cases: data.cases[date],
                                deaths: data.deaths[date],
                                recovered: data.recovered[date],
                            });
                        }
                        return mappedData;
                    })
                )
                .subscribe((data) => {
                    this.coronaHistorical.next(data)
                }
                    // this.coronaHistorical = data;
                );
        }
    }
}

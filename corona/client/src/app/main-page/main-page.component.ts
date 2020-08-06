import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MapService } from '../services/map.service';
import { CoronaDataService } from '../services/corona-data.service';
import { CoronaHistoricalMapped } from '../model/corona.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, OnDestroy {
    coronaHistoricalData: CoronaHistoricalMapped;
    coronaSubscription: Subscription;
    mapSubscription: Subscription;

    countryName: string;

    constructor(
        private zone: NgZone,
        private _coronaDataService: CoronaDataService,
        private _mapService: MapService
    ) {}

    ngOnInit(): void {
        this.coronaSubscription = this._coronaDataService.coronaHistorical.subscribe(
            (data) => {
                this.zone.run(
                    () => (this.coronaHistoricalData = data[data.length - 1])
                );
            }
        );

        this.mapSubscription = this._mapService.selectedCountry.subscribe(
            (countryName) => {
                this.zone.run(() => (this.countryName = countryName));
            }
        );
    }

    getWorldwideData() {
        this._coronaDataService.fetchCountryHistoricalData();
        this._mapService.setCountry('Worldwide');
    }

    ngOnDestroy() {
        this.coronaSubscription.unsubscribe();
        this.mapSubscription.unsubscribe();
    }
}

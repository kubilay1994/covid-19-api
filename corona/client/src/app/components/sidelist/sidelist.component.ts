import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { CoronaDataService } from '../../services/corona-data.service';
import { CoronaRecord } from '../../models/corona.interface';

import { flatMap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidelist',
    templateUrl: './sidelist.component.html',
    styleUrls: ['./sidelist.component.css'],
})
export class SidelistComponent implements OnInit {
    pie: am4charts.PieChart;
    coronaCountryData: CoronaRecord[] = [];
    subscription: Subscription;

    filterInput = '';

    constructor(
        private zone: NgZone,
        private _coronaDataService: CoronaDataService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {}

    sortBy(key: 'cases' | 'deaths' | 'recovered') {
        this.coronaCountryData.sort((a, b) => b[key] - a[key]);
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.pie = am4core.create('piediv', am4charts.PieChart);

            let firstFiveCountries: CoronaRecord[];

            this.subscription = this._coronaDataService.coronaCountries
                .pipe(
                    flatMap(result => {
                        this.coronaCountryData = result;
                        this.cdRef.detectChanges();
                        firstFiveCountries = result.slice(0, 5);
                        return this._coronaDataService.coronaTotal.pipe(
                            take(1)
                        );
                    })
                )
                .subscribe(worldWideData => {
                    if (worldWideData) {
                        let otherCases =
                            worldWideData.timeline[0].cases -
                            firstFiveCountries.reduce(
                                (acc, curr) => acc + curr.cases,
                                0
                            );

                        this.pie.data = [
                            ...firstFiveCountries,
                            { country: 'Other', cases: otherCases },
                        ];
                    }
                });

            let pieSeries = this.pie.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = 'cases';
            pieSeries.dataFields.category = 'country';
            pieSeries.labels.template.disabled = true;

            this.pie.legend = new am4charts.Legend();
        });
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            if (this.pie) {
                this.pie.dispose();
            }
        });
        this.subscription.unsubscribe();
    }
}

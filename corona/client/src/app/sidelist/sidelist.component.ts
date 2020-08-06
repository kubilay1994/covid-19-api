import {
    Component,
    OnInit,
    Input,
    NgZone,
    ChangeDetectorRef,
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { CoronaDataService } from '../services/corona-data.service';
import { CoronaCountryRecord } from '../model/corona.interface';

import { flatMap } from 'rxjs/operators';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-sidelist',
    templateUrl: './sidelist.component.html',
    styleUrls: ['./sidelist.component.css'],
})
export class SidelistComponent implements OnInit {
    pie: am4charts.PieChart;
    coronaCountryData: CoronaCountryRecord[] = [];
    subscription: Subscription;
    totalSubscription: Subscription;


    filterInput = '';

    private _mode = 'normal';

    get mode() {
        return this._mode;
    }

    @Input()
    set mode(mode: string) {
        if (mode) {
            this._mode = mode;
        }
    }

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
        this.zone.runOutsideAngular(async () => {
            this.pie = am4core.create('piediv', am4charts.PieChart);

            let firstFiveCountries: CoronaCountryRecord[];
            this.subscription = this._coronaDataService.coronaCountries
                .pipe(
                    flatMap((result) => {
                        this.coronaCountryData = result;
                        this.cdRef.detectChanges();
                        firstFiveCountries = result.slice(0, 5);
                        return this._coronaDataService.coronaTotal;
                    })
                )
                .subscribe((worldWideData) => {
                    let otherCases =
                        worldWideData.cases -
                        firstFiveCountries.reduce(
                            (acc, curr) => acc + curr.cases,
                            0
                        );

                    this.pie.data = [
                        ...firstFiveCountries,
                        { country: 'Other', cases: otherCases },
                    ];
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

            this.subscription.unsubscribe();
        });
    }
}

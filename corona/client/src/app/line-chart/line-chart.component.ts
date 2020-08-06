import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { CoronaDataService } from '../services/corona-data.service';
import { Subscription } from 'rxjs';
import { MapService } from '../services/map.service';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, AfterViewInit {
    lineChart: am4charts.XYChart;
    subscription: Subscription;
    mapSubscription: Subscription;

    selectedCountry: string;

    constructor(
        private zone: NgZone,
        private _coronaDataService: CoronaDataService,
        private _mapService: MapService
    ) {}

    ngOnInit(): void {
        this.mapSubscription = this._mapService.selectedCountry.subscribe(
            (countryName) => {
                this.zone.run(() => {
                    this.selectedCountry = countryName;
                });
            }
        );
    }

    private createLineSeries(
        name: string,
        valueY: string,
        color: string,
        tooltipText?: string
    ) {
        let series = this.lineChart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = valueY;
        series.dataFields.dateX = 'date';
        series.name = name;
        series.strokeWidth = 3;
        series.stroke = am4core.color(color);
        if (tooltipText) {
            series.tooltipText = tooltipText;
        }
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.lineChart = am4core.create('linediv', am4charts.XYChart);

            this.subscription = this._coronaDataService.coronaHistorical.subscribe(
                (data) => {
                    this.lineChart.data = data;
                }
            );

            let dateAxis = this.lineChart.xAxes.push(new am4charts.DateAxis());
            dateAxis.dataFields.date = 'date';
            let valueAxis = this.lineChart.yAxes.push(
                new am4charts.ValueAxis()
            );
            valueAxis.renderer.opposite = true;

            this.createLineSeries(
                'Cases',
                'cases',
                'red',
                `[bold]{date}[/]
            [bold]Cases[/] : {cases}
            [bold]Deaths[/] : {deaths}
            [bold]Recovered[/] : {recovered}`
            );
            this.createLineSeries('Deaths', 'deaths', 'grey');
            this.createLineSeries('Recovered', 'recovered', 'green');

            this.lineChart.cursor = new am4charts.XYCursor();
            this.lineChart.legend = new am4charts.Legend();

            this.lineChart.legend.position = 'top';
            this.lineChart.scrollbarX = new am4charts.XYChartScrollbar();
            this.lineChart.scrollbarX.parent = this.lineChart.bottomAxesContainer;
        });
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            if (this.lineChart) {
                this.lineChart.dispose();
            }

            this.subscription.unsubscribe();
        });
        this.mapSubscription.unsubscribe();
    }
}

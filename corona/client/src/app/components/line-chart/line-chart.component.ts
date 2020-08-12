import { Component, OnInit, NgZone, AfterViewInit, Input } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CoronaHistoricalRecord } from 'src/app/models/corona.interface';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, AfterViewInit {
    @Input() currCoronaRecord: BehaviorSubject<CoronaHistoricalRecord>;
    lineChart: am4charts.XYChart;
    subscription: Subscription;

    constructor(private zone: NgZone) {}

    ngOnInit(): void {}

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

            this.subscription = this.currCoronaRecord.subscribe(data => {
                if (data) {
                    this.lineChart.data = [...data.timeline].reverse();
                }
            });

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

            this.lineChart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
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
        });
        this.subscription.unsubscribe();
    }
}

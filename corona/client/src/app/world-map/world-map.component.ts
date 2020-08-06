import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';

import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldlow';

import { CoronaDataService } from '../services/corona-data.service';
import { CoronaCountryRecord } from '../model/corona.interface';
import { Subscription } from 'rxjs';
import { MapService } from '../services/map.service';

@Component({
    selector: 'app-world-map',
    templateUrl: './world-map.component.html',
    styleUrls: ['./world-map.component.css'],
})
export class WorldMapComponent implements OnInit, AfterViewInit {
    map: am4maps.MapChart;
    countrySubscription: Subscription;

    
    constructor(
        private zone: NgZone,
        private _coronaDataService: CoronaDataService,
        private _mapService: MapService
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.map = am4core.create('chartdiv', am4maps.MapChart);
            this.map.geodata = am4geodata_worldLow;
            // ... chart code goes here ...

            let polygonSeries = new am4maps.MapPolygonSeries();
            polygonSeries.useGeodata = true;
            polygonSeries.calculateVisualCenter = true;
            polygonSeries.exclude = ['AQ', 'GL'];

            this.map.series.push(polygonSeries);
            let polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.fill = am4core.color('#bbb');
            let activeState = polygonTemplate.states.create('active');
            activeState.properties.fill = am4core.color('#aabbcc');

            polygonTemplate.events.on('hit', (ev) => {
                ev.target.series.chart.zoomToMapObject(ev.target);

                let countryInfo = ev.target.dataItem.dataContext as {
                    id: string;
                    name: string;
                };

                this._coronaDataService.fetchCountryHistoricalData(
                    countryInfo.id
                );
                this._mapService.setCountry(countryInfo.name);

            });

            // Create hover state and set alternative fill color
            let hs = polygonTemplate.states.create('hover');
            hs.properties.fill = am4core.color('#ddd');

            polygonTemplate.propertyFields.fill = 'fill';

            let imageSeries = this.map.series.push(
                new am4maps.MapImageSeries()
            );

            this.countrySubscription = this._coronaDataService.coronaCountries.subscribe(
                (data) => {
                    imageSeries.data = data;
                }
            );

            imageSeries.dataFields.value = 'cases';

            let imageSeriesTemplate = imageSeries.mapImages.template;
            imageSeriesTemplate.nonScaling = true;

            imageSeriesTemplate.adapter.add('latitude', (latitude, target) => {
                let polygon = polygonSeries.getPolygonById(
                    (target.dataItem.dataContext as CoronaCountryRecord)
                        .countryInfo.iso2
                );
                if (polygon) {
                    return polygon.visualLatitude;
                }
                return latitude;
            });

            imageSeriesTemplate.adapter.add(
                'longitude',
                (longitude, target) => {
                    let polygon = polygonSeries.getPolygonById(
                        (target.dataItem.dataContext as CoronaCountryRecord)
                            .countryInfo.iso2
                    );
                    if (polygon) {
                        return polygon.visualLongitude;
                    }
                    return longitude;
                }
            );

            let circle = imageSeriesTemplate.createChild(am4core.Circle);
            circle.fillOpacity = 0.7;
            circle.fill = am4core.color('tomato');
            circle.tooltipText = `[bold]{country}[/]
                                Vaka Sayısı : [bold]{cases}[/]
                                Ölüm : [bold]{deaths}[/]
                                İyileşme : [bold]{recovered}[/]`;

            imageSeries.heatRules.push({
                target: circle,
                property: 'radius',
                min: 3,
                max: 20,
                dataField: 'value',
            });

            this.map.zoomControl = new am4maps.ZoomControl();
            this.map.maxZoomLevel = 10;
        });
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            if (this.map) {
                this.map.dispose();
            }
            this.countrySubscription.unsubscribe();
        });
    }
}

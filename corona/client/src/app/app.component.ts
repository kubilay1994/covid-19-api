import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';

import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_frozen from '@amcharts/amcharts4/themes/frozen';

import { CoronaDataService } from './services/corona-data.service';

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_frozen);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    constructor(private _coronaDataService: CoronaDataService) {}

    ngOnInit() {}
}

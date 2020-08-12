import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CoronaRecord } from 'src/app/models/corona.interface';
import { CoronaDataService } from 'src/app/services/corona-data.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
    coronaCountryData: BehaviorSubject<CoronaRecord[]>;

    countryFilter = '';

    constructor(private coronaService: CoronaDataService) {}

    ngOnInit(): void {
        this.coronaCountryData = this.coronaService.coronaCountries;
    }
}

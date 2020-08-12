import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CoronaDataService } from '../../services/corona-data.service';
import { CoronaHistoricalRecord } from '../../models/corona.interface';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
    currCoronaRecord = new BehaviorSubject<CoronaHistoricalRecord>(null);

    constructor(private _coronaDataService: CoronaDataService) {}

    ngOnInit(): void {
        this._coronaDataService.coronaTotal
            .pipe(take(2))
            .subscribe(res => this.currCoronaRecord.next(res));
    }

    getWorldwideData() {
        this._coronaDataService.coronaTotal.pipe(take(1)).subscribe(data => {
            this.currCoronaRecord.next(data);
        });
    }
}

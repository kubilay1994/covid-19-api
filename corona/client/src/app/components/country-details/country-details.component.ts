import { Component, OnInit } from '@angular/core';
import { CoronaDataService } from 'src/app/services/corona-data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';

import { TimelineRecord } from 'src/app/models/timelineRecord';
import { CoronaHistoricalRecord } from 'src/app/models/corona.interface';

@Component({
    selector: 'app-country-details',
    templateUrl: './country-details.component.html',
    styleUrls: ['./country-details.component.css'],
})
export class CountryDetailsComponent implements OnInit {
    historicalData: Observable<CoronaHistoricalRecord>;
    countryId: string;

    constructor(
        private coronaDataService: CoronaDataService,
        private adminService: AdminService,
        private route: ActivatedRoute,
        private alertService: AlertService
    ) {}

    onSubmit(form: NgForm) {
        this.adminService
            .updateCountryTimeline(form.value as TimelineRecord, this.countryId)
            .subscribe(
                res =>
                    this.alertService.successAlert({
                        title: 'Success',
                        message: res.message,
                    }),
                err => {
                    this.alertService.errorAlert({
                        title: 'Error',
                        message: 'Update Failed',
                        errorMessage: 'Update Failed',
                    });
                }
            );
    }

    onListItemSelected(form: NgForm, data: TimelineRecord) {
        form.setValue(data);
    }

    ngOnInit(): void {
        this.countryId = this.route.snapshot.params.countryId;
        this.historicalData = this.coronaDataService.fetchCountryHistoricalRecord(
            this.countryId
        );
    }
}

import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';
import { TimelineRecord } from '../models/timelineRecord';
import { take, concatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    updateCountryTimeline(data: TimelineRecord, code: string) {
        return this.authService.token.pipe(
            take(1),
            concatMap(token => {
                return this.http.patch<{ message: string }>(
                    `api/corona/timeline/${code}`,
                    data,
                    {
                        headers: new HttpHeaders({
                            Authorization: `Bearer ${token}`,
                        }),
                    }
                );
            })
        );
    }
}

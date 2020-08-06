import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MapService {
    selectedCountry = new BehaviorSubject<string>('Worldwide');

    constructor() {}

    setCountry(country: string) {
        this.selectedCountry.next(country);
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { CoronaCountryRecord } from '../model/corona.interface';

@Pipe({
    name: 'filter',
})
export class FilterPipe implements PipeTransform {
    transform(
        value: CoronaCountryRecord[],
        input: string
    ): CoronaCountryRecord[] {
        if (value.length === 0 || !input) {
            return value;
        }
        return value.filter((item) => item.country.includes(input));
    }
}

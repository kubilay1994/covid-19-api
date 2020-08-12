import { Pipe, PipeTransform } from '@angular/core';
import { CoronaRecord } from '../models/corona.interface';

@Pipe({
    name: 'filter',
})
export class FilterPipe implements PipeTransform {
    transform(value: CoronaRecord[], input: string): CoronaRecord[] {
        if (value.length === 0 || !input) {
            return value;
        }
        return value.filter(item =>
            item.country.toLowerCase().includes(input.toLowerCase())
        );
    }
}

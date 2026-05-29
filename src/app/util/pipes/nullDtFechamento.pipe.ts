import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullValue'
})
export class NullDtFechamentoPipe implements PipeTransform {
  transform(value: any, defaultValue: string): string {
    return value || defaultValue;
  }
}

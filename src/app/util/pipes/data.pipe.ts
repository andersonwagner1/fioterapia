import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'data',
  standalone: true
})
export class DataPipe implements PipeTransform {


    private datePipe: DatePipe = new DatePipe('en-US');

    transform(value: any): string | null {
      if (!value) return null;

      // Converte a data para o formato 'dd/MM/yyyy'
      return this.datePipe.transform(value, 'dd/MM/yyyy');
    }
}

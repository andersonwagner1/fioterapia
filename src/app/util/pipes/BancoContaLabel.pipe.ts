import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bancoContaLabel',
  standalone: true
})
export class BancoContaLabelPipe implements PipeTransform {

  transform(bancoConta: any): string {
    return bancoConta ? `${bancoConta.banco.dsBanco} + ${bancoConta.conta.dsConta}` : '';
  }

}

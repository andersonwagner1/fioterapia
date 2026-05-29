import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moeda',
  standalone: true
})
export class MoedaPipe implements PipeTransform {

  transform(value: number, currencySymbol: string = 'R$', decimalLength: number = 2): string {
    if (value === null || value === undefined) return null;
 
    // Formatação do valor para moeda brasileira
    return currencySymbol + ' ' + value
      .toFixed(decimalLength)  // Define o número de casas decimais
      .replace('.', ',')  // Substitui o ponto pelo separador decimal
      .replace(/\d(?=(\d{3})+,)/g, '$&.');  // Adiciona o separador de milhar
  }
}

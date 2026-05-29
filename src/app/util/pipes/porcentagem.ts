import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'porcentagem',
  standalone: true
})
export class PorcentagemPipe implements PipeTransform {

  transform(value: number,  decimalLength: number = 2): string {
    if (value === null || value === undefined) return null;

    
    if(value >= 0){
      return "+" + value
      .toFixed(decimalLength)  // Define o número de casas decimais
      .replace('.', ',')  // Substitui o ponto pelo separador decimal
      .replace(/\d(?=(\d{3})+,)/g, '$&.') + " %";  // Adiciona o separador de milhar
    }else{
      return "-" + value
      .toFixed(decimalLength)  // Define o número de casas decimais
      .replace('.', ',')  // Substitui o ponto pelo separador decimal
      .replace(/\d(?=(\d{3})+,)/g, '$&.')+ " %";  // Adiciona o separador de milhar
    }

    // Formatação do valor para moeda brasileira
   
  }
}

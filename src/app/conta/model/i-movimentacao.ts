import { BancoConta } from "./banco-conta";
import { IAplicacao } from "./i-aplicacao";
import { ICompetencia } from "./i-competencia"
import { IInvestimento } from "./i-investimento";
import { ITipoMovimentacao } from "./i-tipo-movimentacao";
import { Identifiable } from "./identifiable";

export interface IMovimentacao extends Identifiable{
    
    competencia : ICompetencia;
    bancoConta: BancoConta;
    tipoMovimentacao ?: ITipoMovimentacao;
    vinculado ?: IMovimentacao; // caso seja para transferencia // ou investimentos
    investimento?: IInvestimento; // categoria para onde foi o dinheiro;

    nrPosicao ?: number; // usado mais para ordenar
    dtMovimentacao ?: Date; // auxiliar para ajudar, assim não será necessario escolher data e hora e evitar erro de colocar no mes errado
    nrDia ?: number;
    vlCredito ?: number;
    vlDebito ?: number;
    vlSaldo ?: number;
    dsObservacao ?: string; //descrição que aconteceu

    icCalcular ?: string // sim constar no calcular // não não constar no calculo?

    repetir ?: number // repeti a quantidade de vezes para colocar no registro



}

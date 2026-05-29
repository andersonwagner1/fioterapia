import { BancoConta } from "./banco-conta";
import { ICompetencia } from "./i-competencia";
import { Identifiable } from "./identifiable";

export interface IMovimentacaoFinal extends Identifiable{
    
    competencia? : ICompetencia;
    bancoConta? : BancoConta;
    vlSaldoInicial? : number;
    vlSaldoFinal? : number;
    vlTotalCredito? : number;
    vlTotalDebito? : number;

    vlEsperado? : number;
	vlEsperadoCredito? : number;
	vlEsperadoDebito? : number;

    icFechado? : string;
}

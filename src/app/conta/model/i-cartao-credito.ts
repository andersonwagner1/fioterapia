import { BancoConta } from "./banco-conta";
import { ICompetencia } from "./i-competencia";
import { ITipoMovimentacao } from "./i-tipo-movimentacao";
import { Identifiable } from "./identifiable";

export interface ICartoaCredito extends Identifiable{
    
    bancoConta? : BancoConta;
    competencia? :ICompetencia;
    nrDia: string;
    dtMovimentacao : Date;
    vlCompra : number
    dsObservacao : string;
    nrParcelas : number;
    tipoMovimentacao? : ITipoMovimentacao;
    
}

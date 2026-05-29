import { Banco } from "./banco";
import { Conta } from "./conta";
import { ICompetencia } from "./i-competencia";
import { Identifiable } from "./identifiable";

export interface BancoConta extends Identifiable{
   
    id? : number;
    banco? : Banco;
    conta?  : Conta;
    

    icTipoConta? : string // C = CORRENTE; I = INVESTIMENTO; (quando for investimento o sistema não permite nenhum tipo de movimentaão)
    dtAbertura? : ICompetencia;
    dtFechamento? : ICompetencia;
}

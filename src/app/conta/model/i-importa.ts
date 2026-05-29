import { BancoConta } from "./banco-conta";
import { ICompetencia } from "./i-competencia";
import { Identifiable } from "./identifiable";

export interface IImporta extends Identifiable{
    
   
	id : number;
	dtCarga : Date;
	bancoConta : BancoConta;
	competencia : ICompetencia;
	nrDia : number;
	dtMovimentacao : Date;
	descricao :string;
	 vlCredito : number ;
	 VlDebito: number;
	 nomeArquivo : string;

	 icVerificar :string;
    
}

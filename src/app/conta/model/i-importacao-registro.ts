import { BancoConta } from "./banco-conta";
import { ICategoriaMovimentacao } from "./i-categoria-movimentacao";
import { IImportacao } from "./i-importacao";
import { IInvestimento } from "./i-investimento";
import { ITipoMovimentacao } from "./i-tipo-movimentacao";

export interface IImportacaoRegistro{
   filtro : IImportacao;
   idTipoMovimentacao : string,
   transferenciaSelecionada : BancoConta;
   tipoInvestimento : IInvestimento; 
   dsObservacao : string;
   arquivoCsv : string;
   nomeArquivo : string;
   vlCredito : number;
   vlDebito: number;
   nrDia:number;
   id : number;
}

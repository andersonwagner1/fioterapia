import { BancoConta } from "./banco-conta";

export interface IImportacao{
    
   nrAno : number;
   nrMes : number;
   bancoConta : string;
    arquivoCsv : string | any[][]; 
   nomeArquivo : string;
   dadosBanco: BancoConta;
    tabelaCsv : string[][]; // <-- Deve ser ARRAY DE ARRAYS (string[][])



    dsBanco? : string;         // Nome do banco identificado
      dtInicial? : string;        // Data inicial do período (em formato string)
      dtFinal? : string;          // Data final do período (em formato string)



}

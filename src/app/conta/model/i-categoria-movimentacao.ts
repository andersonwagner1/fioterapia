import { Identifiable } from "./identifiable";
export interface ICategoriaMovimentacao extends Identifiable{
    
    dsCategoria? : string;
    dsObservacao? : string;

    icTipo? : string; //C = Credito // D = DEBITO // M = MOVIMETACAO//  O = OUTROS (CORREÇÕES, JUROS, VALOS DESCONHECIDOS)

}

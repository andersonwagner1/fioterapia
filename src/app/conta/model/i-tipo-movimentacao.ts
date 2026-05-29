import { ICategoriaMovimentacao } from "./i-categoria-movimentacao";
import { Identifiable } from "./identifiable";

export interface ITipoMovimentacao extends Identifiable{
    
    dsTipoMovimentacao : string;
    dsObservacao: string;

    categoria : ICategoriaMovimentacao;

    icTipoMovimentacao : string;
    icRelatorio : string
    id: number

}

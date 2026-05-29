import { BancoConta } from "./banco-conta";
import { Identifiable } from "./identifiable";

export interface IInvestimento extends Identifiable{
    
    bancoConta: BancoConta; //apenas banco conta do tipo investimento corretora
    dsInvestimento: string;
    id?: number;

    
}

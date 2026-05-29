import { BancoConta } from "./banco-conta";
import { Identifiable } from "./identifiable";

export interface ITransferencia extends Identifiable{
    
    bancoConta? : BancoConta;
    transferirPara? : BancoConta;
    
}

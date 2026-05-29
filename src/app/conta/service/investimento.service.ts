import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BasicoService } from './basico.service';

import { BancoConta } from '../model/banco-conta';
import { map, Observable } from 'rxjs';
import { IImporta } from '../model/i-importa';
import { IInvestimento } from '../model/i-investimento';


@Injectable({
  providedIn: 'root'
})
export class InvestimentoService extends BasicoService<IInvestimento> {



    constructor( http: HttpClient) {
        super(http, "investimento");

    }

    listarTodosBancoInvestimentoAtivo():Observable<BancoConta[]>{        
        return this.http.get<BancoConta[]> (this.BANCO_CONTA_LISTA_APENAS_INVESTIMENTO_ATIVO).pipe(map((response : any )=>{
            return response.data;
        }))
    }

    listarInvestimentoPorBancoConta(bancoId : number, contaId : number) : Observable<IInvestimento[]>{

        console.log(this.INVESTIMENTO_POR_BANCO_CONTA + "/" + bancoId +"/" + contaId );
        return this.http.get<IInvestimento[]> (this.INVESTIMENTO_POR_BANCO_CONTA + "/" + bancoId +"/" + contaId ).pipe(map((response : any )=>{
            console.log("lista investimentos");
            console.log(response.data);
            return response.data;
        }))
    }
}

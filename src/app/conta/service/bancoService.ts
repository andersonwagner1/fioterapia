import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { BasicoService } from './basico.service';
import { Banco } from '../model/banco';
import { ICompetencia } from '../model/i-competencia';
import { BancoConta } from '../model/banco-conta';



@Injectable()
export class BancoService  extends BasicoService<Banco> {

    constructor( http: HttpClient) {
        super(http, "banco");

    }


    public listarBancosPorCompetencia(competencia : ICompetencia) : Observable<Banco[]>{

        return this.http.post(this.BANCO_CONTA_LISTAR_POR_COMPETENCIA, competencia).pipe(map((response: any) => {
            console.log(response.data);
            return response.data;
         //   this.icons = response.icons;
          //  return this.icons;
        }));
    }

    public listarContaPorBanco(banco : Banco, competencia:ICompetencia) : Observable<BancoConta[]>{
        let bancoConta : BancoConta = {
            banco : banco,
            dtAbertura : competencia

        }

        return this.http.post(this.CONTA_LISTAR_POR_CONTA,bancoConta).pipe(map((response  : any)=>{
            return response.data;
        }));
    }

    public listarFiltroBanco(id: Number) : Observable<Banco[]>{
        return this.http.get<Banco[]>(this.BANCO_POR_ID).pipe(tap(console.log))
    }

    public consultarBancoContaPorIdBancoConta(bancoConta : BancoConta){
        return this.http.get<BancoConta>(this.BANCO_CONTA_CONSULTAR_POR_BANCO_CONTA  + bancoConta.banco.id + "/" + bancoConta.conta.id).pipe(tap(console.log))
    }

}

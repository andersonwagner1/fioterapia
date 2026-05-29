import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMovimentacao } from '../model/i-movimentacao';
import { BasicoService } from './basico.service';
import { map, Observable } from 'rxjs';
import { BancoConta } from '../model/banco-conta';
import { Conta } from '../model/conta';
import { Banco } from '../model/banco';

@Injectable({
  providedIn: 'root'
})
export class BancoContaService extends BasicoService<BancoConta> {
    listarBancoContasPorContasAtivo(idBanco: number) {
        return this.http.get(this.BANCO_CONTA_LISTAR_POR_BANCO + "/" + idBanco).pipe(map((response : any)=>{
            console.log(response.data);
            return response.data
        }))
    }

    listarBancosDisponives(bancoConta : BancoConta) {

        return this.http.get(this.BANCO_CONTA_SEM_VINCULSO + "/" + bancoConta.id).pipe(map((response : any) => {
            console.log(response.data);
            return response.data;
        }));
    }


    listaBancosAtivo() {
        let bancoConta :  BancoConta ={icSituacao : 'SIM'};
        return this.http.post(this.BANCO_CONTA_FILTRAR, bancoConta).pipe(map((response : any) => {
            console.log(response.data);
            return response.data;
        }));
    }

    constructor( http: HttpClient) {
        super(http,"banco-conta");

        this.listaBancosAtivo();

    }

    getBuscarPorBancoId(banco : Banco) : Observable<BancoConta[]>{
        return this.http.post(this.BANCO_CONTA_LISTAR_POR_BANCO,banco).pipe(map((response : any) => {
            return response.data;
        }));
    }


    listarBancoContaDisponveisPorBanco(banco : Banco): Observable<BancoConta[]>{
        return this.http.post(this.BANCO_CONTA_LISTAR_POR_BANCO, banco).pipe(map((response : any) => {
            console.log(response.data);
            return response.data;
        }));
    }

}

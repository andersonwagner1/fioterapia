import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITipoMovimentacao } from '../model/i-tipo-movimentacao';
import { BasicoService } from './basico.service';
import { IAplicacao } from '../model/i-aplicacao';
import { BancoConta } from '../model/banco-conta';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AplicacaoService extends BasicoService<IAplicacao> {



    constructor( http: HttpClient) {
        super(http, "aplicacao");

    }

    listarAplicacoesDisponveisPorBanco(bancoConta : BancoConta) : Observable<IAplicacao[]>{
        return this.http.get<IAplicacao[]>(this.APLICACAO_LISTAR_DISPONIVEIS_POR_BANCO).pipe(map((response : any) => {
            console.log(response.data);
            return response.data;
        }));
    }
}

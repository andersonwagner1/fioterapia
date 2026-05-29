import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMovimentacao } from '../model/i-movimentacao';
import { BasicoService } from './basico.service';
import { map, Observable } from 'rxjs';
import { BancoConta } from '../model/banco-conta';

import { Banco } from '../model/banco';
import { ICartoaCredito } from '../model/i-cartao-credito';

@Injectable({
  providedIn: 'root'
})
export class CartaoCreditoService extends BasicoService<ICartoaCredito> {
    


    constructor( http: HttpClient) {
        super(http,"cartao-credito");

      

    }

    listarBancoQuePossuimCartaoCreditoPorCompetencia(idCompetencia: number)  {
        return this.http.get(this.BANCO_CONTA_LISTAR_CARTAO_CREDITO_POR_COMPETENCIA + "/" + idCompetencia).pipe(map((response : any)=>{
            console.log(response.data);
            return response.data
        }))
    }


    listarTipoMovimentacaoDebitoAtivos()  {
        return this.http.get(this.TIPO_MOVIMENTACAO_LISTA_DEBITOS_ATIVOS).pipe(map((response : any)=>{
            console.log(response.data);
            return response.data
        }))
    }

  
    

    listarMovimentacaoPorBancoCompetncia(idBAncoConta: number, idCompetencia : number ){
        return this.http.get(this.CARTAO_CREDITO_LISTAR_POR_COMPETENCIA + "/" + idBAncoConta + "/" + idCompetencia).pipe(map((response : any)=>{
            console.log(response.data);
            return response.data
        }))
    }


  
}

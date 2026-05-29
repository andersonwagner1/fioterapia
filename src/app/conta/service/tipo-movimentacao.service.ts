import { Injectable } from '@angular/core';
import { BasicoService } from './basico.service';
import { ITipoMovimentacao } from '../model/i-tipo-movimentacao';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoMovimentacaoService extends BasicoService<ITipoMovimentacao> {



    constructor( http: HttpClient) {
        super(http,"tipo-movimentacao");

    }

    public listarDebitosAtivos () : Observable<ITipoMovimentacao[]>{
        return this.http.get(this.TIPO_MOVIMENTACAO_LISTA_DEBITOS_ATIVOS).pipe(map((response: any) => {
           
            return response.data;        
        }));
    }


    public listarTipoMovimentacao () : Observable<String[]>{
        return this.http.get(this.TIPO_MOVIMENTACAO_LISTA_TODO_TIPO_MOVIMENTACAO).pipe(map((response: any) => {
           
            return response.data;        
        }));
    }

    public listarRelatorio () : Observable<String[]>{
        return this.http.get(this.TIPO_MOVIMENTACAO_LISTA_TODO_RELATORIO).pipe(map((response: any) => {           
            return response.data;        
        }));
    }



    public listaTipoMovimentacaoPorNome(nome : string) : Observable<ITipoMovimentacao[]>{
        return this.http.post(this.TIPO_MOVIMENTACAO_LISTAR_POR_NOME, nome).pipe(map((response: any) => {     
            console.log(response)      
            return response.data;        
        }));
    }


     public listaTipoMovimentacaoTodos() : Observable<ITipoMovimentacao[]>{
        return this.http.get(this.TIPO_MOVIMENTACAO_LISTA_TODOS).pipe(map((response: any) => {     
            console.log(response)      
            return response.data;        
        }));
    }


}

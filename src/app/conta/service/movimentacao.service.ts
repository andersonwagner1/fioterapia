import { Injectable } from '@angular/core';
import { IMovimentacao } from '../model/i-movimentacao';
import { BasicoService } from './basico.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IMovimentacaoFinal } from '../model/i-movimentacao-final';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService  extends BasicoService<IMovimentacao>{
    calcularSaldoFinal(registro: IMovimentacaoFinal) : Observable<IMovimentacaoFinal>{
     return this.http.post(this.MOVIMENTACAO_SALVAR_SALDO, registro).pipe(map((response : any ) =>{
     
        return response.data;
     }))
    }


    constructor( http: HttpClient) {
        super(http,"movimentacao");

    }

    migrar(id : number): Observable<any>{
        return this.http.get(this.PROVISORIO + "/" + id).pipe(map((response : any) => {
           
            return response.data;
        }));
    }

    listarDetalheMovimentacaoRelatorio(tipoRelatorio : string, mes: number, ano : number): Observable<IMovimentacao[]>{
       
        return this.http.get(this.MOVIMENTACAO_DETALHE_RELATORIO  + "/" + mes + "/" + ano + "/" + tipoRelatorio).pipe(map((response : any) => {
            return response.data;
        }));
    }

    listarMovimentacaoPorCompetenciaBancoConta(registro : IMovimentacao): Observable<IMovimentacao[]>{
       
        return this.http.post(this.MOVIMENTACAO_LISTAR_COMPETENCIA_BANCO_CONTA, registro).pipe(map((response : any) => {
         //   console.log(response.data);
            return response.data;
        }));
    }

    salvarMovimentacao(registro : IMovimentacao) : Observable<IMovimentacao>{
       // console.log("salvar movimentação");
        return this.http.post(this.MOVIMENTACAO_SALVAR,registro).pipe(map((response : any)=> {
            return response.data;
        }));

    }

    alterarBancoCompetencia(id: number, competenciaId: number, bancoContaId : number) :Observable<IMovimentacao>{
        let movimentacao : IMovimentacao ={
            id : id,
            bancoConta : {
                id : bancoContaId
            },
            competencia :{
                id : competenciaId
            }
        }

        
        return this.http.post(this.MOVIMENTACAO_ALTERAR_COMPETENCIA_BANCO, movimentacao).pipe(map((response : any)=> {
            return response.data;
        }));
    }





}

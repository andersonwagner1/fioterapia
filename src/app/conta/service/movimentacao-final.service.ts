import { Injectable } from '@angular/core';
import { IMovimentacao } from '../model/i-movimentacao';
import { BasicoService } from './basico.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IMovimentacaoFinal } from '../model/i-movimentacao-final';
import { BancoConta } from '../model/banco-conta';
import { ICompetencia } from '../model/i-competencia';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoFinalService  extends BasicoService<IMovimentacaoFinal>{
    atualizarCalculo(registro: IMovimentacaoFinal) : Observable<IMovimentacaoFinal> {
        return this.http.post(this.MOVIMENTACAO_CALCULAR, registro).pipe(map((response : any) => {
            return response.data;
        }));

    }


    constructor( http: HttpClient) {
        super(http,"movimentacao-final");

    }

    mostrarSaldoFinalPorCompetenciaBanco(competencia : ICompetencia, bancoconta :BancoConta){
        return this.http.get(this.MOVIMENTACAO_FINAL_CONSULTAR_POR_BANCO_COMPETENCIA  + competencia.nrMes +"/"+ competencia.nrAno +"/" + bancoconta.banco.id +"/" +bancoconta.conta.id ).pipe(map((response : any) => {           
            return response.data;
        }));
    }


/*

    listarMovimentacaoPorCompetenciaBancoConta(bancoconta :BancoConta, competencia : ICompetencia){
        return this.http.get(this.MOVIMENTACAO_FINAL_CONSULTAR_POR_BANCO_COMPETENCIA  + competencia.nrMes +"/"+ competencia.nrAno +"/" + bancoconta.banco.id +"/" +bancoconta.conta.id ).pipe(map((response : any) => {
            console.log("Movimentacoa Final ", response);
            return response.data;
        }));
    }
*/

    /*listarMovimentacaoPorCompetenciaBancoConta(registro : IMovimentacao): Observable<IMovimentacaoFinal>{
        return this.http.get(this.MOVIMENTACAO_FINAL_CONSULTAR_POR_BANCO_COMPETENCIA  + registro.competencia.nrMes +"/"+ registro.competencia.nrAno +"/" + registro.bancoConta.banco.id +"/" +registro.bancoConta.conta.id ).pipe(map((response : any) => {
            console.log("Movimentacoa Final ", response);
            return response.data;
        }));
    }*/


    consultarQuantidadeRegistroPorcompetencia(ano : number, mes : number): Observable<Object[]>{
       
        return this.http.get(this.MOVIMENTACAO_FINAL_QUANTIDADE_REGISTRO  + ano + "/" + mes).pipe(map((response : any) => {
            return response.data;
        }));
    }



}

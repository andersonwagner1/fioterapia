import { Injectable } from '@angular/core';
import { ITransferencia } from '../model/i-transferencia';
import { HttpClient } from '@angular/common/http';
import { BasicoService } from './basico.service';
import { BancoConta } from '../model/banco-conta';
import { map, Observable } from 'rxjs';
import { ICompetencia } from '../model/i-competencia';

@Injectable({
  providedIn: 'root'
})




export class RelatorioService extends BasicoService<ITransferencia> {
    graficoRelatorioCredito(ano: number) {
        return this.http.get(this.GRAFICO_CREDITO + "/" + ano).pipe(map((resposne: any)=>{
            return resposne.data;
        } ))
    }

    listarGraficoSankey (competencia : ICompetencia){
          return this.http.get(this.RELATORIO_SANKEY + "/" + competencia.nrMes + "/" + competencia.nrAno).pipe(map((resposne: any)=>{
            return resposne.data;
        } ))
    }

    tabelaRelatorioBancoFinal(ano: number){
        return this.http.get(this.TABELA_BANCO_FINAL + "/" + ano).pipe(map((resposne: any)=>{
            return resposne.data;
        } ))
    }

    tabelaRelatorioBancoFinalReal(ano: number){
        return this.http.get(this.TABELA_BANCO_FINAL_REAL + "/" + ano).pipe(map((resposne: any)=>{
            return resposne.data;
        } ))
    }


    graficoCrescimento(ano: number) {
        console.log(this.GRAFICO_CRECIMENTO + "/" + ano);
        return this.http.get(this.GRAFICO_CRECIMENTO + "/" + ano).pipe(map((response : any)=>{
            return response.data;
        }))
    }

    graficoCredtioDebito(ano: number) {
        console.log(this.GRAFICO_CREDITO_DEBITO + "/" + ano);
        return this.http.get(this.GRAFICO_CREDITO_DEBITO + "/" + ano).pipe(map((response : any)=>{
            return response.data;
        }))
    }
    
    listarIncosistencia(){
        return this.http.get(this.RELATORIO_INCOSISTENCIA).pipe(map((resposne: any)=>{
            return resposne.data;
        } ))
    }

    
    listarPainelValores(ano : number){
        return this.http.get(this.RELATORIO_MOSTRAR_FINAL + "/" + ano).pipe(map((resposne: any)=>{
            return resposne.data;
        } ))
    }

    
    listarPainelMovimentacaoFinal(ano : number){
        return this.http.get(this.RELATORIO_MOVIMENTACAO_FINANCEIRA + "/" + ano).pipe(map((resposne: any)=>{
            return resposne.data;
        } ))
    }
    
    
    
    listarRelatorioFinal(ano: number) {
        console.log(this.RELATORIO_MOSTRAR_FINAL + "/" + ano);
        return this.http.get(this.RELATORIO_MOSTRAR_FINAL + "/" + ano).pipe(map((response : any)=>{
            return response.data;
        }))
    }

   


    listarMostrarFinal(ano : number){

    }

   



    constructor( http: HttpClient) {
        super(http,"relatorio");
    }


}

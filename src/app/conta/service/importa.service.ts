import { Injectable } from '@angular/core';
import { BasicoService } from './basico.service';
import { ITipoMovimentacao } from '../model/i-tipo-movimentacao';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IImporta } from '../model/i-importa';
import { IImportacao } from '../model/i-importacao';

@Injectable({
  providedIn: 'root'
})
export class ImportaService extends BasicoService<IImporta> {



    constructor( http: HttpClient) {
        super(http,"importar");

    }

    public identificarBanco(primeiraLinhaCsv: string): Observable<{codigo: number, bancoConta: string}> {
    return this.http.post<{codigo: number, bancoConta: string}>(this.IDENTIFICAR_BANCO_URL, { linha: primeiraLinhaCsv });
}

    public enviarDadosArquivo(payload: IImportacao): Observable<IImporta[]> {
        return this.http.post(this.ENVIAR_ARQUIVO_IMPORTACAO, payload).pipe(
            map((response: any) => {
                return response.data;
            })
        );
    }

     public listarBancosDisponivel(): Observable<any[]> {
        return this.http.get(this.LISTAR_BANCOS_DISPONIVEL_IMPORTACAO).pipe(
            map((response: any) => {
                return response.data;
            })
        );
    }

    

    public salvarRegistro(payload : any): Observable<String> {
        return this.http.post(this.SALVAR_DADOS_IMPORTACAO, payload).pipe(
            map((response: any) => {
                return response.data;
            })
        );        
    }
 public adicionarRegistro(payload : any): Observable<String> {
        return this.http.post(this.SALVAR_REGISTRO_MOVIMENTACAO, payload).pipe(
            map((response: any) => {
                return response.data;
            })
        );        
    }


  /*  public enviarDadosArquivo (csv : string[] ) : Observable<IImporta[]>{
        return this.http.post(this.ENVIAR_ARQUIVO_IMPORTACAO, csv).pipe(map((response: any) => {
           
            return response.data;        
        }));
    }
*/
     public getDadosRelacionado (bancoConta : string , mes : number, ano : number) : Observable<any>{
        return this.http.get(this.MOSTRARA_DADOS_IMPORTACAO + "/" + bancoConta + "/" + mes + "/" + ano).pipe(map((response: any) => {           
            return response;
        }));
    }


    public listarMigracaoRealizada ( ano : number) : Observable<any>{
        return this.http.get(this.LISTAR_MIRACAO_REALIZADA + "/" + ano).pipe(map((response: any) => {           
            return response;
        }));
    }


    


   


}

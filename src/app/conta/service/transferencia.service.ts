import { Injectable } from '@angular/core';
import { ITransferencia } from '../model/i-transferencia';
import { HttpClient } from '@angular/common/http';
import { BasicoService } from './basico.service';
import { BancoConta } from '../model/banco-conta';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})




export class TransferenciaService extends BasicoService<ITransferencia> {
    listarTransferenciaPorBancoConta(bancoConta: BancoConta) {
        return this.http.post(this.TRANSFERENCIA_LISTAR_POR_BANCO_CONTA,bancoConta).pipe(map((response : any)=>{
            return response.data;
        }))
    }


    consultarTransferencia(registro: ITransferencia) {
        return this.http.post(this.TRANSFERENCIA_ID,registro).pipe(map((response : any)=>{
            return response.data;
        }))
    }



    constructor( http: HttpClient) {
        super(http,"transferencia");
    }


}

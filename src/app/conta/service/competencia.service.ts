import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BasicoService } from './basico.service';
import { Conta } from '../model/conta';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CompetenciaService extends BasicoService <Conta>{
   

    constructor( http: HttpClient) {
        super(http, "competencia");
    }

    /**
     * objetivo retornar o id filtranod por mes e ano
     * 
     * @param mes mes
     * @param ano ano
     */
    get(mes : number, ano : number){
      return this.http.get(this.COMPETENCIA_CONSULTA_MES_ANO +"/" + mes + "/" + ano).pipe(map((response  : any)=>{
        return response.data;
    }));
     
    }
}

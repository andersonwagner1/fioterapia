import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BasicoService } from './basico.service';
import { Conta } from '../model/conta';



@Injectable({
  providedIn: 'root'
})
export class ContaService extends BasicoService <Conta>{

    constructor( http: HttpClient) {
        super(http, "conta");

    }
}

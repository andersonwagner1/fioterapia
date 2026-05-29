import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BasicoService } from './basico.service';
import { Conta } from '../model/conta';
import { ICategoriaMovimentacao } from '../model/i-categoria-movimentacao';



@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BasicoService <ICategoriaMovimentacao>{

    constructor( http: HttpClient) {
        super(http, "categoria");

    }
}

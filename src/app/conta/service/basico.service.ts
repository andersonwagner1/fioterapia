import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnderecoesModule } from 'src/app/util/enderecoes/enderecoes.module';
import { Identifiable } from '../model/identifiable';

@Injectable({
  providedIn: 'root'
})
export class BasicoService<T extends Identifiable> extends EnderecoesModule {
  http: HttpClient;

  tipo : string;

  constructor(http : HttpClient, tipo : string) {
      super();
      this.http = http;
      this.tipo = tipo;
  }



  public salvar(registro : T ){

    console.log("salvar 3", registro);
    console.log(`${environment.API}/${this.tipo}${environment.SALVAR}`);
    return this.http.post(`${environment.API}/${this.tipo}${environment.SALVAR}`, registro).pipe(map((response: any) => {
        return response.data;
    }));
}

public excluir(registro : any,){
    registro.icSituacao = 'NAO';
    return this.http.post(`${environment.API}/${this.tipo}${environment.EXCLUIR}`, registro).pipe(map((response: any)=> {
        return response.data;
    }));
}


public listar(registro : T ){
    return this.http.post(`${environment.API}/${this.tipo}${environment.LISTA}`, registro).pipe(map((response: any) => {
        console.log(response.data);
        return response.data;
    }));
}

public listarTodos(){
    let l : any = {
        id : 0
    }
    let result : any =  this.listar(l);
    console.log(result);
    return result;
}






  public getPorId(id: number) : Observable<T>{

    return this.http.get<T>(`${environment.API}/${this.tipo}${environment.ID}${id}`).pipe(map((response : any)=>{
        return response.data;
    }));

}



}

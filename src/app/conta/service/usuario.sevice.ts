import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Prontuario } from '../model/iprontuario.component';
import { IUsuario } from '../model/iusuario.component';


@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente na aplicação
})
export class UsuarioService {

  private url = "http://localhost:8096/api/usuarios";


  constructor(private http: HttpClient) {}

  salvar(usuario: IUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.url + "/salvar", usuario);
  }

  // Busca todos os prontuários (Mapeado do arquivo de testes)
  getUsuarios(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(this.url + "/listar-todos");
  }

  getUsuarioById(id: number): Observable<IUsuario | undefined> {
    return this.http.get<IUsuario | undefined>(this.url + "/consulta/" + id);
  }

  listarProntuariosPorFiltro(prontaurio : Prontuario): Observable<Prontuario[]> {
     return this.http.post<Prontuario[]>(this.url + "/filtro", prontaurio);
  }
}
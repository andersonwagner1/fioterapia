import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EvolucaoClinica, Prontuario } from '../model/iprontuario.component';
import { IUsuario } from '../model/iusuario.component';


@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente na aplicação
})
export class EvolucaoService {

  private url = "http://localhost:8096/api/evolucao";


  constructor(private http: HttpClient) {}

  salvar(evolucao: EvolucaoClinica): Observable<EvolucaoClinica> {
    console.log(evolucao);
    return this.http.post<Prontuario>(this.url + "/salvar", evolucao);
  }

  // Busca todos os prontuários (Mapeado do arquivo de testes)
  getEvolucao(): Observable<EvolucaoClinica[]> {
    return this.http.get<EvolucaoClinica[]>(this.url + "/listar-todos");
  }

  getEvolucaoPorPaciente(idPaciente : number): Observable<EvolucaoClinica[] | undefined> {
    return this.http.get<EvolucaoClinica[] | undefined>(this.url + "/listar-por-paciente/" + idPaciente);
  }

  getEvolucaoById(id: number): Observable<EvolucaoClinica | undefined> {
    return this.http.get<EvolucaoClinica | undefined>(this.url + "/consulta/" + id);
  }





  listarProntuariosPorFiltro(prontaurio : Prontuario): Observable<Prontuario[]> {
     return this.http.post<Prontuario[]>(this.url + "/filtro", prontaurio);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prontuario } from '../model/iprontuario.component';
import { Agendamento, AgendamentoEditar } from '../model/iagendamento.component';
import { AgendamentoRespostaDto } from '../model/dto/iagendamentoResposta.component';



@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private url = "http://localhost:8096/api/agendamento";

  constructor(private http: HttpClient) { }

   salvar(agendamento: Agendamento): Observable<Agendamento> {
     return this.http.post<Agendamento>(this.url + "/salvar", agendamento);
   }
 
   // Busca todos os prontuários (Mapeado do arquivo de testes)
   getAgendamentos(): Observable<Agendamento[]> {
     return this.http.get<Agendamento[]>(this.url + "/listar-todos");
   }

    consultarAgendamentoPorData(dtFiltro : Date): Observable<AgendamentoRespostaDto[]> {
     return this.http.post<AgendamentoRespostaDto[]>(this.url + "/listar-por-data",dtFiltro);
   }
 
 
   getAgendamentoById(id: number): Observable<AgendamentoEditar | undefined> {
     return this.http.get<AgendamentoEditar | undefined>(this.url + "/consulta/" + id);
   }
}
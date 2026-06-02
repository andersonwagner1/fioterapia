import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Agendamento {
  id?: number;
  prontuarioId?: number | null;
  nomePaciente?: string;
  dataHoraInicio?: Date | string;
  dataHoraFim?: Date | string;
  profissional?: string;
  tipoSessao?: string;
  status?: string;
  observacoes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private jsonUrl = 'assets/data/agendamentos-mock.json';

  constructor(private http: HttpClient) { }

  getAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.jsonUrl);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Prontuario } from '../model/iprontuario.compoent';


@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente na aplicação
})
export class ProntuarioService {
  
  // Caminho do arquivo JSON simulando o endpoint da API Java
  private jsonUrl = 'assets/data/prontuarios-mock.json';

  constructor(private http: HttpClient) {}

  // Busca todos os prontuários (Mapeado do arquivo de testes)
  getProntuarios(): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(this.jsonUrl);
  }

  getProntuarioById(id: number): Observable<Prontuario | undefined> {
  // 1. Faz o download do arquivo JSON contendo o array completo de Prontuario[]
  return this.http.get<Prontuario[]>(this.jsonUrl).pipe(
    
    // 2. O 'pipe' abre espaço para usarmos operadores do RxJS.
    // 3. O 'map' transforma o dado original (a lista) no dado que queremos (um único objeto)
    map((prontuarios: Prontuario[]) => {
      
      // 4. O método '.find()' do JavaScript varre o array em busca do ID correspondente
      return prontuarios.find(p => p.id === id);
    })
  );
}
}
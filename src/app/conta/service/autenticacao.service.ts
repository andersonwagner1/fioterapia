import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UsuarioService } from './usuario.sevice';
import { IUsuario } from '../model/iusuario.component';
import { HttpClient } from '@angular/common/http';

// Definição dos perfis/funções aceitas no ecossistema da clínica
export type FuncaoUsuario = 'ADMINISTRADOR' | 'FISIOTERAPEUTA' | 'ATENDENTE';

// Contrato que rege quais ações um usuário específico pode fazer em uma tela
export interface UsuarioPermissao {
  idUsuario: number;
  nomeUsuario: string;
  emailUsuario: string;
  funcao: FuncaoUsuario;
  visualizar: boolean; // Controla se o usuário enxerga/acessa a página
  incluir: boolean;    // Controla botões de "Salvar", "Cadastrar", etc.
  alterar: boolean;    // Controla botões de "Editar", "Modificar", etc.
}

// Estrutura que mapeia as rotas oficiais do sistema para o controle do Administrador
export interface TelaSistema {
  id: string;
  nome: string;
  rota: string;
  modulo: string;
  permissoesUsuarios: UsuarioPermissao[];
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  
  public isAuthenticated = signal<boolean>(this.hasToken());

  // Estado volátil do usuário autenticado no momento
  private usuarioLogado: any = null;

    private url = "http://localhost:8096/api/usuarios";

  constructor(private http: HttpClient) {}


  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Retorna o token salvo para os interceptors
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  loginToken(resposta: any) {
  const tokenPuro = resposta && resposta.token ? resposta.token : resposta;
  localStorage.setItem('token', tokenPuro);
  this.isAuthenticated.set(true);
}

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    // Redirecionar para a tela de login, se necessário
  }

  isTokenExpired(): boolean {
    
  const token = this.getToken();
  console.log(token);
  if (!token) return true;

  try {
    // 1. Pega a parte do meio (o payload do JWT)
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;

    // 2. Substitui os caracteres do padrão JWT para o Base64 padrão que o atob entende
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 3. Decodifica a string com segurança lidando com acentos/caracteres especiais
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    // 4. Transforma em objeto e pega a expiração
    const expiry = JSON.parse(jsonPayload).exp;
    
    // 5. Compara com o tempo atual em segundos
    const tempoAtual = Math.floor((new Date()).getTime() / 1000);
    
    return tempoAtual >= expiry;

  } catch (e) {
    // Se cair aqui, vamos printar o erro real no console do navegador (F12) para saber o motivo
    console.error("Erro crítico ao decodificar o token JWT:", e);
    return true; 
  }
}

  

  /**
   * Realiza a autenticação varrendo a matriz reversa de telas para montar a sessão
   * @param email E-mail digitado no formulário
   * @param senha Senha informada (Padrão mock: 123456)
   */
login(usuario : IUsuario): Observable<any> {
  return this.http.post<any>(`${this.url}/autenticacao`, usuario);
}


  
  /**
   * Verifica em tempo de execução se o usuário ativo pode Visualizar, Incluir ou Alterar em uma tela específica.
   * Utilizado por Guards de rotas e diretivas estruturais como *ngIf no HTML.
   */
  temPermissao(telaId: string, acao: 'visualizar' | 'incluir' | 'alterar'): boolean {
   /* const usuarioSessao = this.getUsuarioLogado();
    if (!usuarioSessao) return false;

    const tela = this.telasMock.find(t => t.id === telaId);
    if (!tela) return false;

    const permissao = tela.permissoesUsuarios.find(p => p.idUsuario === usuarioSessao.id);*/
    return true; //permissao ? (permissao as any)[acao] === true : false;
  }

  /**
   * Retorna o status se há alguma sessão ativa salva no navegador
   */
  estaLogado(): boolean {
    return this.getUsuarioLogado() !== null;
  }

  /**
   * Recupera o objeto do usuário logado da memória RAM ou do LocalStorage (Persistência pós-F5)
   */
  getUsuarioLogado(): any {
    if (!this.usuarioLogado) {
      const dadosLocal = localStorage.getItem('usuario_clinica');
      if (dadosLocal) {
        this.usuarioLogado = JSON.parse(dadosLocal);
      }
    }
    return this.usuarioLogado;
  }

  /**
   * Validação retrocompatível de perfil exigido por Guards antigos
   */
  temPerfil(funcaoEsperada: FuncaoUsuario): boolean {
    const usuario = this.getUsuarioLogado();
    return usuario ? usuario.funcao === funcaoEsperada : false;
  }

  /**
   * Retorna a lista completa de telas e rotas para alimentação do painel do Administrador
   */
  getTelasSistemas(): Observable<TelaSistema[]> {
    return null;
  }

  /**
   * Altera a linha de permissão de um usuário específico de dentro de uma tela escolhida
   */
  salvarPermissaoTela(telaId: string, permissaoAtualizada: UsuarioPermissao): Observable<boolean> {
  
    return of(true);
  }
}
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

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

  // BANCO DE DADOS EM MEMÓRIA (MOCK): Centraliza as telas, rotas e quem manda em que
  private telasMock: TelaSistema[] = [
    {
      id: 'painel',
      nome: 'Painel Clínico (Dashboard)',
      rota: '/pages/painel',
      modulo: 'Atendimento',
      permissoesUsuarios: [
        { idUsuario: 1, nomeUsuario: 'Dr. Anderson', emailUsuario: 'anderson@clinica.com.br', funcao: 'ADMINISTRADOR', visualizar: true, incluir: true, alterar: true },
        { idUsuario: 2, nomeUsuario: 'Juliana Silva', emailUsuario: 'juliana@clinica.com.br', funcao: 'ATENDENTE', visualizar: true, incluir: false, alterar: false }
      ]
    },
    {
      id: 'agenda',
      nome: 'Agenda de Sessões',
      rota: '/pages/agenda',
      modulo: 'Agendamento',
      permissoesUsuarios: [
        { idUsuario: 1, nomeUsuario: 'Dr. Anderson', emailUsuario: 'anderson@clinica.com.br', funcao: 'ADMINISTRADOR', visualizar: true, incluir: true, alterar: true },
        { idUsuario: 2, nomeUsuario: 'Juliana Silva', emailUsuario: 'juliana@clinica.com.br', funcao: 'ATENDENTE', visualizar: true, incluir: true, alterar: true }
      ]
    },
    {
      id: 'prontuario',
      nome: 'Prontuário e Evolução Clínica',
      rota: '/pages/prontuario',
      modulo: 'Clínico',
      permissoesUsuarios: [
        { idUsuario: 1, nomeUsuario: 'Dr. Anderson', emailUsuario: 'anderson@clinica.com.br', funcao: 'ADMINISTRADOR', visualizar: true, incluir: true, alterar: true },
        { idUsuario: 2, nomeUsuario: 'Juliana Silva', emailUsuario: 'juliana@clinica.com.br', funcao: 'ATENDENTE', visualizar: false, incluir: false, alterar: false } // Bloqueio LGPD estrutural
      ]
    },
    {
      id: 'config',
      nome: 'Configurações de Acesso',
      rota: '/pages/config',
      modulo: 'Segurança',
      permissoesUsuarios: [
        { idUsuario: 1, nomeUsuario: 'Dr. Anderson', emailUsuario: 'anderson@clinica.com.br', funcao: 'ADMINISTRADOR', visualizar: true, incluir: true, alterar: true },
        { idUsuario: 2, nomeUsuario: 'Juliana Silva', emailUsuario: 'juliana@clinica.com.br', funcao: 'ATENDENTE', visualizar: false, incluir: false, alterar: false }
      ]
    }
  ];

  // Estado volátil do usuário autenticado no momento
  private usuarioLogado: any = null;

  constructor() { }

  /**
   * Realiza a autenticação varrendo a matriz reversa de telas para montar a sessão
   * @param email E-mail digitado no formulário
   * @param senha Senha informada (Padrão mock: 123456)
   */
  login(email: string, senha: string): Observable<any> {
    const emailLimpo = email.trim().toLowerCase();

    if (senha !== '123456') {
      return throwError(() => new Error('Senha incorreta. Use a senha padrão: 123456'));
    }

    let usuarioEncontrado: any = null;

    // Varre as telas para encontrar o cadastro básico do usuário através do e-mail
    for (const tela of this.telasMock) {
      const permissaoUsuario = tela.permissoesUsuarios.find(p => p.emailUsuario.toLowerCase() === emailLimpo);

      if (permissaoUsuario) {
        usuarioEncontrado = {
          id: permissaoUsuario.idUsuario,
          nome: permissaoUsuario.nomeUsuario,
          funcao: permissaoUsuario.funcao,
          email: emailLimpo
        };
        break; // Usuário mapeado, interrompe a busca
      }
    }

    if (usuarioEncontrado) {
      this.usuarioLogado = usuarioEncontrado;
      localStorage.setItem('usuario_clinica', JSON.stringify(usuarioEncontrado));
      return of(usuarioEncontrado);
    }

    return throwError(() => new Error('Usuário não cadastrado no sistema.'));
  }

  /**
   * Destrói os tokens e dados locais efetuando a desconexão segura do profissional
   */
  logout(): void {
    this.usuarioLogado = null;
    localStorage.removeItem('usuario_clinica');
  }

  /**
   * Verifica em tempo de execução se o usuário ativo pode Visualizar, Incluir ou Alterar em uma tela específica.
   * Utilizado por Guards de rotas e diretivas estruturais como *ngIf no HTML.
   */
  temPermissao(telaId: string, acao: 'visualizar' | 'incluir' | 'alterar'): boolean {
    const usuarioSessao = this.getUsuarioLogado();
    if (!usuarioSessao) return false;

    const tela = this.telasMock.find(t => t.id === telaId);
    if (!tela) return false;

    const permissao = tela.permissoesUsuarios.find(p => p.idUsuario === usuarioSessao.id);
    return permissao ? (permissao as any)[acao] === true : false;
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
    return of(this.telasMock);
  }

  /**
   * Altera a linha de permissão de um usuário específico de dentro de uma tela escolhida
   */
  salvarPermissaoTela(telaId: string, permissaoAtualizada: UsuarioPermissao): Observable<boolean> {
    const tela = this.telasMock.find(t => t.id === telaId);
    if (tela) {
      const idx = tela.permissoesUsuarios.findIndex(p => p.idUsuario === permissaoAtualizada.idUsuario);
      if (idx !== -1) {
        tela.permissoesUsuarios[idx] = { ...permissaoAtualizada };
        return of(true);
      }
    }
    return of(false);
  }
}
import { Component, OnInit } from '@angular/core';
import { AutenticacaoService, TelaSistema, UsuarioPermissao } from '../../../service/autenticacao.service';

@Component({
  selector: 'app-usuarios-config',
  templateUrl: './usuarios-config.component.html'
})
export class UsuariosConfigComponent implements OnInit {

  telas: TelaSistema[] = [];
  
  // Estados para o Modal de Usuários
  exibirModalUsuarios = false;
  telaSelecionada: TelaSistema | null = null;
  listaUsuariosPermissao: UsuarioPermissao[] = [];

  // Opções Sim/Não para o Dropdown de permissões
  opcoesSimNao = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false }
  ];

  constructor(private authService: AutenticacaoService) { }

  ngOnInit(): void {
    this.carregarTelas();
  }

  carregarTelas(): void {
    this.authService.getTelasSistemas().subscribe(dados => this.telas = dados);
  }

  /**
   * Abre o modal trazendo os usuários vinculados àquela tela específica
   */
  gerenciarUsuariosDaTela(tela: TelaSistema): void {
    this.telaSelecionada = tela;
    // Clona a lista para evitar alteração direta na memória sem clicar em "Salvar"
    this.listaUsuariosPermissao = JSON.parse(JSON.stringify(tela.permissoesUsuarios));
    this.exibirModalUsuarios = true;
  }

  /**
   * Disparado ao clicar no botão "Salvar" individual de cada usuário do modal
   */
  salvarAlteracaoUsuario(permissaoUsuario: UsuarioPermissao): void {
    if (!this.telaSelecionada) return;

    this.authService.salvarPermissaoTela(this.telaSelecionada.id, permissaoUsuario).subscribe({
      next: (sucesso) => {
        if (sucesso) {
          console.log(`Permissões de ${permissaoUsuario.nomeUsuario} atualizadas na tela ${this.telaSelecionada?.nome}`);
          this.carregarTelas(); // Recarrega a tabela de fundo
        }
      }
    });
  }
}
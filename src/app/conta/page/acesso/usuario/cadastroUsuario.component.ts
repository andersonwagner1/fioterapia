import { Component, OnInit, inject } from '@angular/core';

import { FuncaoUsuario, UsuarioPermissao } from '../../../service/autenticacao.service';
import { ConfirmationService } from 'primeng/api'; // <-- Importando o serviço
import { BasePermissaoComponent } from '../../base-permissao.component';
import { IUsuario } from '../../../model/iusuario.component';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastroUsuario.component.html'
})
export class CadastroUsuarioComponent extends BasePermissaoComponent implements OnInit {

  protected override telaId = 'config' as const;

  // Injeção moderna do serviço de confirmação do PrimeNG
  private confirmationService = inject(ConfirmationService);

  novoUsuario :IUsuario = {
    nome: '',
    email: '',
    funcao: 'ATENDENTE' as FuncaoUsuario,
    ativo: true,
    cpf: '',
    telefone: ''  
  };

  opcoesFuncoes = [
    { label: '👑 Administrador (Acesso Total)', value: 'ADMINISTRADOR' },
    { label: '🩺 Fisioterapeuta (Clínico)', value: 'FISIOTERAPEUTA' },
    { label: '💼 Atendente (Recepção/Agenda)', value: 'ATENDENTE' }
  ];

  loading = false;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Dispara o fluxo de confirmação visual na tela
   */
  confirmarSalvamento(): void {
    if (!this.oPodeIncluir()) return;
    if (!this.novoUsuario.nome || !this.novoUsuario.email) return;

    this.confirmationService.confirm({
      message: `Deseja realmente cadastrar o profissional <strong>${this.novoUsuario.nome}</strong> com o perfil de <strong>${this.novoUsuario.funcao}</strong> no sistema?`,
      header: 'Confirmar Cadastro de Usuário',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Cadastrar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        // Se clicar em SIM, executa a gravação de fato
        this.executarSalvamento();
      }
    });
  }

  /**
   * Lógica interna que grava os dados e gera o feedback final
   */
  private executarSalvamento(): void {
    this.loading = true;

    this.authService.getTelasSistemas().subscribe(telas => {
      const novoIdUsuario = Math.floor(Math.random() * 1000) + 3; 

      telas.forEach(tela => {
        const novaPermissaoTela: UsuarioPermissao = {
          idUsuario: novoIdUsuario,
          nomeUsuario: this.novoUsuario.nome,
          emailUsuario: this.novoUsuario.email,
          funcao: this.novoUsuario.funcao,
          visualizar: this.definirVisualizacaoPadrao(this.novoUsuario.funcao, tela.id),
          incluir: this.novoUsuario.funcao === 'ADMINISTRADOR' || (this.novoUsuario.funcao === 'ATENDENTE' && tela.id === 'agenda'),
          alterar: this.novoUsuario.funcao === 'ADMINISTRADOR' || (this.novoUsuario.funcao === 'ATENDENTE' && tela.id === 'agenda')
        };
        tela.permissoesUsuarios.push(novaPermissaoTela);
      });

      this.loading = false;

      // Abre um segundo ConfirmDialog, agindo como modal informativo de Sucesso
      this.confirmationService.confirm({
        message: `O colaborador <strong>${this.novoUsuario.nome}</strong> foi registrado com sucesso e suas diretrizes de acesso foram criadas.`,
        header: 'Sucesso!',
        icon: 'pi pi-check-circle text-green-500 text-2xl',
        rejectVisible: false, // Esconde o botão de cancelar
        acceptLabel: 'OK',
        acceptButtonStyleClass: 'p-button-success',
        accept: () => {
          // Limpa o formulário e navega de volta para as tabelas
          
          this.router.navigate(['/pages/config']);
        }
      });
    });
  }

  private definirVisualizacaoPadrao(funcao: FuncaoUsuario, telaId: string): boolean {
    if (funcao === 'ADMINISTRADOR') return true;
    if (funcao === 'FISIOTERAPEUTA' && telaId !== 'config') return true;
    if (funcao === 'ATENDENTE' && (telaId === 'painel' || telaId === 'agenda')) return true;
    return false;
  }
}
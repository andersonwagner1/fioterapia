import { Component, OnInit, inject } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { BasePermissaoComponent } from '../../base-permissao.component';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html'
})
export class AlterarSenhaComponent extends BasePermissaoComponent implements OnInit {

  // Usamos 'painel' para garantir que qualquer usuário logado consiga acessar essa tela
  protected override telaId = 'painel' as const;
  private confirmationService = inject(ConfirmationService);

  // Modelo do formulário
  dadosSenha = {
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: ''
  };

  loading = false;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit(); // Executa a barreira para garantir que o usuário está logado
  }

  /**
   * Validações de segurança antes de abrir o modal de confirmação
   */
  solicitarAlteracao(): void {
    if (!this.dadosSenha.senhaAtual || !this.dadosSenha.novaSenha || !this.dadosSenha.confirmarNovaSenha) {
      return;
    }

    // Validação 1: A nova senha precisa ser diferente da atual
    if (this.dadosSenha.senhaAtual === this.dadosSenha.novaSenha) {
      this.confirmationService.confirm({
        message: 'A nova senha não pode ser igual à senha atual. Por favor, escolha uma senha diferente.',
        header: 'Aviso de Segurança',
        icon: 'pi pi-exclamation-circle text-amber-500',
        rejectVisible: false,
        acceptLabel: 'Entendido',
        acceptButtonStyleClass: 'p-button-warning'
      });
      return;
    }

    // Validação 2: Senhas precisam coincidir
    if (this.dadosSenha.novaSenha !== this.dadosSenha.confirmarNovaSenha) {
      this.confirmationService.confirm({
        message: 'A confirmação de senha não confere com a nova senha digitada.',
        header: 'Erro de Validação',
        icon: 'pi pi-times-circle text-red-500',
        rejectVisible: false,
        acceptLabel: 'Corrigir',
        acceptButtonStyleClass: 'p-button-danger'
      });
      return;
    }

    // Validação 3: Força mínima (Exemplo: mínimo de 6 caracteres)
    if (this.dadosSenha.novaSenha.length < 6) {
      this.confirmationService.confirm({
        message: 'Para sua segurança, a nova senha deve conter no mínimo 6 caracteres.',
        header: 'Senha Fraca',
        icon: 'pi pi-shield text-orange-500',
        rejectVisible: false,
        acceptLabel: 'Ok',
        acceptButtonStyleClass: 'p-button-warning'
      });
      return;
    }

    // Se passou em tudo, abre o prompt de confirmação definitivo
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja alterar sua senha de acesso? Você precisará usar a nova credencial no seu próximo login.',
      header: 'Confirmar Alteração de Senha',
      icon: 'pi pi-lock',
      acceptLabel: 'Sim, Alterar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.executarTrocaDeSenha();
      }
    });
  }

  private executarTrocaDeSenha(): void {
    this.loading = true;

    // Simulação da chamada HTTP para o Servidor/Mock
    setTimeout(() => {
      this.loading = false;

      this.confirmationService.confirm({
        message: 'Sua senha foi atualizada com sucesso no banco de dados corporativo.',
        header: 'Senha Alterada!',
        icon: 'pi pi-check-circle text-green-500 text-2xl',
        rejectVisible: false,
        acceptLabel: 'Voltar ao Painel',
        acceptButtonStyleClass: 'p-button-success',
        accept: () => {
          // Limpa o formulário e redireciona para a Home de segurança
          this.dadosSenha = { senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' };
          this.router.navigate(['/pages/painel']);
        }
      });
    }, 1200); // Pequeno delay simulando rede
  }
}
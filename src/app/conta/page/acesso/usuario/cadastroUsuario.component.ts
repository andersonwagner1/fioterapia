import { Component, OnInit, inject } from '@angular/core';

import { FuncaoUsuario, UsuarioPermissao } from '../../../service/autenticacao.service';
import { ConfirmationService, MessageService } from 'primeng/api'; // <-- Importando o serviço
import { BasePermissaoComponent } from '../../base-permissao.component';
import { IUsuario } from '../../../model/iusuario.component';
import { UsuarioService } from 'src/app/conta/service/usuario.sevice';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastroUsuario.component.html',
    providers: [MessageService]
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

  constructor(private usuarioService : UsuarioService, private messageService: MessageService ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Dispara o fluxo de confirmação visual na tela
   */
  confirmarSalvamento(): void {

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


    this.usuarioService.salvar(this.novoUsuario).subscribe({
      next: (usuarioLogado) => {
        
        this.confirmationService.confirm({
            message: `Salvo com sucesso`,
            header: 'Confirmar Cadastro de Usuário',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Okay',
            
            acceptButtonStyleClass: 'p-button-primary',            
            accept: () => {
              // Se clicar em SIM, executa a gravação de fato
              
            }
    });
        
      
      },
      error: (err) => {
          this.loading = false;

       this.messageService.add({
  severity: 'error', // Define o estilo de erro (vermelho)
  summary: 'Erro no Cadastro',
  detail: 'Não foi possível salvar os dados do usuário.',
  life: 4000 // Tempo em milissegundos para sumir sozinho
});
      }
    });
  }

  
}
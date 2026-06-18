import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../../service/autenticacao.service';
import { MessageService } from 'primeng/api';
import { IUsuario } from 'src/app/conta/model/iusuario.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
    providers: [MessageService]
})
export class LoginComponent {
  email = '';
  senha = '';
  loading = false;
  erroMensagem = '';

  constructor(
    private authService: AutenticacaoService, 
    private messageService: MessageService,
    private router: Router
  ) {}

  usuario : IUsuario ={
    nome: '',
    senha: '',
    email:''
  };

  

  onLogin(): void {

   
    if (!this.usuario.email || !this.usuario.senha) {
      this.messageService.add({ severity: 'warn', summary: 'Campos Obrigatórios', detail: `Campo usuario e senha são campos obrigatórios` });
      return;
    }

  
    this.loading = true;
    this.erroMensagem = '';

    // Dispara a chamada para o nosso Mock Service
    this.authService.login(this.usuario).subscribe({
      next: (usuarioLogado) => {
        this.loading = false;
       
        if(!usuarioLogado){
          this.messageService.add({ severity: 'warn', summary: 'Usuario não encontraod', detail: `Usuario e senha invalido` });
        }else{

            this.authService.loginToken(usuarioLogado);

            this.router.navigate(['/pages/painel']); 
        }
        
        // Redireciona o profissional para a Dashboard do Painel Clínico
      
      },
      error: (err) => {
        this.loading = false;
        // Captura o texto do 'throwError' disparado pelo serviço
        this.erroMensagem = err.message || 'Falha de comunicação com o servidor.';
      }
    });
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../../service/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  senha = '';
  loading = false;
  erroMensagem = '';

  constructor(
    private authService: AutenticacaoService, 
    private router: Router
  ) {}

  onLogin(): void {
    // Validação visual simples antes de mandar pro back-end
    if (!this.email || !this.senha) {
      this.erroMensagem = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.loading = true;
    this.erroMensagem = '';

    // Dispara a chamada para o nosso Mock Service
    this.authService.login(this.email, this.senha).subscribe({
      next: (usuarioLogado) => {
        this.loading = false;
        console.log('Autenticado com sucesso! Usuário:', usuarioLogado.nome);
        
        // Redireciona o profissional para a Dashboard do Painel Clínico
        this.router.navigate(['/pages/painel']); 
      },
      error: (err) => {
        this.loading = false;
        // Captura o texto do 'throwError' disparado pelo serviço
        this.erroMensagem = err.message || 'Falha de comunicação com o servidor.';
      }
    });
  }
}
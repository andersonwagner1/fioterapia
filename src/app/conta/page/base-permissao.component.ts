import { Directive, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../service/autenticacao.service';


// Usamos o decorator @Directive para que o Angular permita a injeção de dependências em classes abstratas
@Directive()
export abstract class BasePermissaoComponent implements OnInit {

  // Utilizando o 'inject' do Angular para não obrigar os componentes filhos 
  // a passarem o serviço no 'super()' do construtor. Isso deixa o código muito mais limpo!
  protected authService = inject(AutenticacaoService);
  protected router = inject(Router);

  // Cada componente filho DEVE obrigatoriamente dizer qual é o seu ID de tela (ex: 'agenda', 'prontuario')
  protected abstract telaId: 'painel' | 'agenda' | 'prontuario' | 'config';

  ngOnInit(): void {
   // this.verificarAcessoTela();
  }

  /**
   * Valida se o usuário tem o direito básico de visualizar a tela.
   * Se não tiver, expulsa ele de volta para o painel.
   */
  protected verificarAcessoTela(): void {
    if (!this.authService.temPermissao(this.telaId, 'visualizar')) {
      console.error(`[Segurança] Acesso negado para a tela: ${this.telaId}`);
      this.router.navigate(['/pages/painel']);
    }
  }

  /**
   * Atalho rápido para testar a permissão de INCLUIR na tela atual
   */
  protected oPodeIncluir(): boolean {
    return this.authService.temPermissao(this.telaId, 'incluir');
  }

  /**
   * Atalho rápido para testar a permissão de ALTERAR na tela atual
   */
  protected oPodeAlterar(): boolean {
    return this.authService.temPermissao(this.telaId, 'alterar');
  }
}
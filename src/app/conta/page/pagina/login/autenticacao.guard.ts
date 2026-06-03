import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from '../../../service/autenticacao.service';


export const autenticacaoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacaoService);
  const router = inject(Router);

  // 1. Regra de Barreira: Se não estiver logado, chuta para a tela de Login
  if (!authService.estaLogado()) {
    console.warn('Acesso recusado. Usuário precisa realizar o login.');
    router.navigate(['/login']);
    return false;
  }

  // 2. Recupera o ID da tela alvo configurado nos metadados (data) do arquivo de rotas
  const telaAlvo = route.data['tela'] as 'painel' | 'agenda' | 'prontuario' | 'config';

  // 3. Se a rota possuir amarração de tela, valida o 'visualizar' na matriz de permissões
  if (telaAlvo) {
    const podeVisualizar = authService.temPermissao(telaAlvo, 'visualizar');

    if (!podeVisualizar) {
      console.error(`🛡️ [Segurança] Usuário bloqueado ao tentar visualizar a tela: ${telaAlvo}`);
      
      // Se for a atendente tentando entrar no prontuário, por exemplo,
      // ela é redirecionada de volta ao painel geral seguro.
      router.navigate(['/pages/painel']);
      return false;
    }
  }

  // Se passou por todas as validações, permite a renderização da página
  return true;
};
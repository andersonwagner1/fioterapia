import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from '../service/autenticacao.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacaoService);
  const router = inject(Router);
    
  // Verifica se tem token e se ele não expirou
  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    return true;
  }

  // Se a sessão finalizou ou não existe, limpa tudo e manda para o login
  authService.logout();
  router.navigate(['/login']);
  return false;
};
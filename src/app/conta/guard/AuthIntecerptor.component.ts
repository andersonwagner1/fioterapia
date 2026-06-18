import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AutenticacaoService } from '../service/autenticacao.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AutenticacaoService);
  const router = inject(Router);
  const token = authService.getToken();

  // Injeta o token no cabeçalho de cada requisição, se ele existir
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Captura a resposta e trata erros de sessão expirada (401)
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Sessão expirou no backend ou token é inválido
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
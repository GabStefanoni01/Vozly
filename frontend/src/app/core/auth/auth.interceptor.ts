import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { ApiAuthService } from '../../services/api-auth.service';

/**
 * Anexa `Authorization: Bearer <access token>` às chamadas da API administrativa.
 *
 * - Endpoints de `/api/v1/auth/**` (exceto `/auth/me`) e `/api/v1/interests` ficam
 *   de fora: são públicos ou usam o refresh cookie + CSRF, tratados pelo ApiAuthService.
 * - Sem token em memória (ex.: página recarregada), renova a sessão antes de enviar.
 * - Em 401 (token expirado — o access token dura 10 min), renova uma vez e
 *   repete; se a renovação falhar, leva para /login preservando a rota atual.
 *
 * Referência: backend/README.md — "Endpoints de autenticação".
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!needsBearer(req)) return next(req);

  const auth = inject(ApiAuthService);
  const router = inject(Router);

  const withToken = (request: HttpRequest<unknown>) => {
    const token = auth.token;
    return token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  };

  return from(auth.ensureSession()).pipe(
    switchMap(() => next(withToken(req))),
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) return throwError(() => err);
      return from(auth.ensureSession(true)).pipe(
        switchMap(ok => {
          if (!ok) {
            void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
            return throwError(() => err);
          }
          return next(withToken(req));
        })
      );
    })
  );
};

function needsBearer(req: HttpRequest<unknown>): boolean {
  const path = pathOf(req.url);
  if (!path.startsWith('/api/v1/') || path.startsWith('/api/v1/interests')) return false;
  return !path.startsWith('/api/v1/auth/') || path === '/api/v1/auth/me';
}

function pathOf(url: string): string {
  try {
    return new URL(url, 'http://relative.invalid').pathname;
  } catch {
    return url;
  }
}

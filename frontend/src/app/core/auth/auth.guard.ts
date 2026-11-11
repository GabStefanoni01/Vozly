import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiAuthService } from '../../services/api-auth.service';

/**
 * Protege o painel: exige sessão válida (access token em memória ou refresh
 * cookie renovável). Sem sessão, redireciona para /login?returnUrl=<rota>.
 *
 * O guard só melhora a navegação — a autorização real é sempre do backend
 * (docs/09 §8: nunca confiar em controles do frontend como barreira de segurança).
 */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(ApiAuthService);
  const router = inject(Router);
  if (await auth.ensureSession()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Destino seguro após login: só aceita caminhos internos (evita open redirect). */
export function safeReturnUrl(value: string | null | undefined, fallback = '/dashboard'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}

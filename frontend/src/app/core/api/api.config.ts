import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Configuração da API administrativa Vozly.
 *
 * Segue a mesma convenção do ApiAuthService (`environment.apiUrl`):
 * - Desenvolvimento local (`environment.ts`): `http://localhost:8080`. O backend
 *   precisa rodar com `SPRING_PROFILES_ACTIVE=local`, que libera CORS para
 *   `http://localhost:4200` (backend/README.md — "Desenvolvimento local").
 * - Build de produção (`environment.prod.ts`): `''` — URL relativa. O frontend e a
 *   API compartilham a mesma origem por meio de proxy reverso, o que mantém os
 *   cookies de autenticação same-origin (docs/12-docker-e-deploy-render.md):
 *     • Docker/Nginx: `frontend/nginx/default.conf.template`.
 *     • Ambiente dev no Render (devvozly): rewrites do static site para
 *       https://vozly.onrender.com (ver docs/12, seção "Ambiente de desenvolvimento").
 *
 * Referência: docs/09-contratos-api-administrativa.md §1 (base `/api/v1`).
 */
export interface VozlyApiConfig {
  /** Base da API administrativa REST. */
  baseUrl: string;
  /** Base dos endpoints do Spring Boot Actuator (health checks). */
  actuatorUrl: string;
}

const origin = environment.apiUrl.replace(/\/$/, '');

export const VOZLY_API_CONFIG = new InjectionToken<VozlyApiConfig>('VOZLY_API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    baseUrl: `${origin}/api/v1`,
    actuatorUrl: `${origin}/actuator`
  })
});

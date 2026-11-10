import { InjectionToken } from '@angular/core';

/**
 * Configuração da API administrativa Vozly.
 *
 * - Em desenvolvimento, `ng serve` usa `proxy.conf.json` para encaminhar
 *   `/api/**` e `/actuator/**` para o Spring Boot em `http://localhost:8080`,
 *   evitando CORS. Suba o backend com `mvn spring-boot:run` na pasta `backend/`.
 * - Em produção, o painel deve ser servido no mesmo domínio da API (ou via
 *   reverse proxy). Se for necessário outro domínio, sobrescreva este token em
 *   `app.config.ts` e configure CORS no backend (allowlist explícita).
 *
 * Referência: docs/09-contratos-api-administrativa.md §1 (base `/api/v1`).
 */
export interface VozlyApiConfig {
  /** Base da API administrativa REST. */
  baseUrl: string;
  /** Base dos endpoints do Spring Boot Actuator (health checks). */
  actuatorUrl: string;
}

export const VOZLY_API_CONFIG = new InjectionToken<VozlyApiConfig>('VOZLY_API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    baseUrl: '/api/v1',
    actuatorUrl: '/actuator'
  })
});

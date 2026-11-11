import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VOZLY_API_CONFIG } from './api.config';
import {
  AgentListItem,
  CallListItem,
  HealthResponse,
  MeResponse,
  OnboardingResponse,
  PageResponse,
  PhoneNumberListItem,
  TenantResponse,
  UsageSummaryResponse
} from './dashboard-api.models';

export type DashboardRange = 'today' | '7d' | '30d';

/**
 * Cliente HTTP da Visão Geral do painel.
 *
 * Cada método documenta o endpoint esperado e o que falta no backend.
 * O guia completo, exibido também na interface, está em `backend-contracts.ts`.
 * Nenhum método simula dados: se a rota não existir, o widget mostra o estado
 * "aguardando backend" com as instruções de implementação.
 */
@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(VOZLY_API_CONFIG);

  /**
   * Saúde da API — `GET /actuator/health`.
   * ✅ JÁ IMPLEMENTADO no backend (Spring Boot Actuator, ver backend/README.md).
   */
  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.config.actuatorUrl}/health`);
  }

  /**
   * Prontidão da aplicação — `GET /actuator/health/readiness`.
   * ✅ JÁ IMPLEMENTADO (management.endpoint.health.probes.enabled=true).
   */
  getReadiness(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.config.actuatorUrl}/health/readiness`);
  }

  /**
   * Usuário autenticado — `GET /api/v1/auth/me`.
   * ✅ IMPLEMENTADO (identity/AuthController). O Bearer token é anexado pelo
   * authInterceptor. Para exibir nome/e-mail, o backend precisa incluir esses
   * campos na resposta (ver BACKEND_CONTRACTS.me).
   */
  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.config.baseUrl}/auth/me`);
  }

  /**
   * Workspace ativo — `GET /api/v1/tenants/current`.
   * ✅ IMPLEMENTADO em DashboardController.currentTenant().
   */
  getCurrentTenant(): Observable<TenantResponse> {
    return this.http.get<TenantResponse>(`${this.config.baseUrl}/tenants/current`);
  }

  /**
   * Progresso do onboarding — `GET /api/v1/onboarding`.
   * ✅ IMPLEMENTADO em DashboardController.onboarding(); etapas sem fonte persistida permanecem pendentes.
   * a partir de pré-requisitos reais. Ver BACKEND_CONTRACTS.onboarding.
   */
  getOnboarding(): Observable<OnboardingResponse> {
    return this.http.get<OnboardingResponse>(`${this.config.baseUrl}/onboarding`);
  }

  /**
   * Indicadores, série diária e motivos de encerramento —
   * `GET /api/v1/usage/summary?from&to&granularity=DAY`.
   * ✅ IMPLEMENTADO em DashboardController.usageSummary(); agregações leem chamadas persistidas.
   * agregações descritas em BACKEND_CONTRACTS.usageSummary.
   */
  getUsageSummary(range: DashboardRange): Observable<UsageSummaryResponse> {
    const { from, to } = DashboardApiService.rangeToPeriod(range);
    const params = new HttpParams()
      .set('from', from.toISOString())
      .set('to', to.toISOString())
      .set('granularity', 'DAY');
    return this.http.get<UsageSummaryResponse>(`${this.config.baseUrl}/usage/summary`, { params });
  }

  /**
   * Últimas chamadas — `GET /api/v1/calls?page=0&size=N&sort=startedAt,desc`.
   * ✅ IMPLEMENTADO em DashboardController.calls(); lista paginada com número
   * de origem mascarado no servidor. Ver BACKEND_CONTRACTS.recentCalls.
   */
  listRecentCalls(size = 6): Observable<PageResponse<CallListItem>> {
    const params = new HttpParams().set('page', 0).set('size', size).set('sort', 'startedAt,desc');
    return this.http.get<PageResponse<CallListItem>>(`${this.config.baseUrl}/calls`, { params });
  }

  /**
   * Agentes do workspace — `GET /api/v1/agents?size=20&sort=updatedAt,desc`.
   * ✅ IMPLEMENTADO em DashboardController.agents() e migration V5.
   */
  listAgents(): Observable<PageResponse<AgentListItem>> {
    const params = new HttpParams().set('page', 0).set('size', 20).set('sort', 'updatedAt,desc');
    return this.http.get<PageResponse<AgentListItem>>(`${this.config.baseUrl}/agents`, { params });
  }

  /**
   * Números telefônicos — `GET /api/v1/phone-numbers`.
   * ✅ Listagem implementada em DashboardController.phoneNumbers(); provisionamento depende da seleção futura do provedor.
   */
  listPhoneNumbers(): Observable<PageResponse<PhoneNumberListItem>> {
    return this.http.get<PageResponse<PhoneNumberListItem>>(`${this.config.baseUrl}/phone-numbers`);
  }

  /** Converte o filtro de período do painel em intervalo UTC [from, to). */
  static rangeToPeriod(range: DashboardRange, now = new Date()): { from: Date; to: Date } {
    const to = now;
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    if (range === '7d') from.setDate(from.getDate() - 6);
    if (range === '30d') from.setDate(from.getDate() - 29);
    return { from, to };
  }
}

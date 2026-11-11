import { Injectable, computed, inject } from '@angular/core';
import { DashboardApiService } from './dashboard-api.service';
import { remoteResource } from './remote-resource';

/**
 * Estado compartilhado do shell do painel: usuário, workspace e saúde da API.
 * Instância única para evitar requisições duplicadas entre layout e páginas.
 */
const ROLE_LABEL: Record<string, string> = { OWNER: 'Proprietário', ADMIN: 'Administrador', OPERATOR: 'Operador' };

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly api = inject(DashboardApiService);

  /** ✅ disponível hoje no backend. */
  readonly health = remoteResource(() => this.api.getHealth());
  /** ✅ GET /api/v1/auth/me — hoje devolve { userId, tenantId, role }. */
  readonly me = remoteResource(() => this.api.getMe());
  /** ⏳ depende de GET /api/v1/tenants/current (módulo tenants). */
  readonly tenant = remoteResource(() => this.api.getCurrentTenant());

  readonly apiOnline = computed(() => this.health.status() === 'ready' && this.health.data()?.status === 'UP');

  readonly firstName = computed(() => this.me.data()?.name?.trim().split(/\s+/)[0] ?? null);

  readonly roleLabel = computed(() => {
    const role = this.me.data()?.role;
    return role ? ROLE_LABEL[role] ?? role : null;
  });

  readonly initials = computed(() => {
    const name = this.me.data()?.name?.trim();
    if (!name) return null;
    const parts = name.split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  });

  refresh(): void {
    this.health.reload();
    this.me.reload();
    this.tenant.reload();
  }
}

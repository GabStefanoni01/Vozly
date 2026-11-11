import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  tenantId: string;
  role: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  workspaceName: string;
}

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private accessToken: string | null = null;
  private pendingRefresh: Promise<boolean> | null = null;

  constructor(private readonly http: HttpClient) {}

  get authenticated(): boolean {
    return this.accessToken !== null;
  }

  /** Access token em memória (nunca persistido), usado pelo authInterceptor. */
  get token(): string | null {
    return this.accessToken;
  }

  /**
   * Garante uma sessão válida: se não há access token (ex.: página recarregada),
   * renova pelo refresh cookie HttpOnly. Chamadas concorrentes compartilham a
   * mesma renovação, porque o refresh token é rotacionado a cada uso.
   * Retorna false quando não há sessão (cookie ausente/expirado).
   */
  ensureSession(force = false): Promise<boolean> {
    if (this.accessToken && !force) return Promise.resolve(true);
    if (!this.pendingRefresh) {
      this.pendingRefresh = this.refresh()
        .then(() => true)
        .catch(() => {
          this.accessToken = null;
          return false;
        })
        .finally(() => {
          this.pendingRefresh = null;
        });
    }
    return this.pendingRefresh;
  }

  async login(email: string, password: string): Promise<void> {
    const csrf = await this.getCsrfToken();
    const result = await firstValueFrom(this.http.post<AuthResponse>(
      `${this.baseUrl}/api/v1/auth/login`, { email, password },
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf }) }
    ));
    this.accessToken = result.accessToken;
  }

  async register(payload: RegisterPayload): Promise<void> {
    const csrf = await this.getCsrfToken();
    const result = await firstValueFrom(this.http.post<AuthResponse>(
      `${this.baseUrl}/api/v1/auth/register`, payload,
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf }) }
    ));
    this.accessToken = result.accessToken;
  }

  private async getCsrfToken(): Promise<string> {
    const response = await firstValueFrom(this.http.get<{ token: string }>(
      `${this.baseUrl}/api/v1/auth/csrf`, { withCredentials: true }
    ));
    return response.token;
  }

  async completeMicrosoftLogin(): Promise<void> {
    const csrf = await firstValueFrom(this.http.get<{ token: string }>(
      `${this.baseUrl}/api/v1/auth/csrf`, { withCredentials: true }
    ));
    const result = await firstValueFrom(this.http.post<AuthResponse>(
      `${this.baseUrl}/api/v1/auth/refresh`, {},
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf.token }) }
    ));
    this.accessToken = result.accessToken;
  }

  async refresh(): Promise<void> {
    const csrf = await firstValueFrom(this.http.get<{ token: string }>(
      `${this.baseUrl}/api/v1/auth/csrf`, { withCredentials: true }
    ));
    const result = await firstValueFrom(this.http.post<AuthResponse>(
      `${this.baseUrl}/api/v1/auth/refresh`, {},
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf.token }) }
    ));
    this.accessToken = result.accessToken;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const csrf = await this.getCsrfToken();
    await firstValueFrom(this.http.post(
      `${this.baseUrl}/api/v1/auth/password/forgot`, { email },
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf }) }
    ));
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const csrf = await this.getCsrfToken();
    await firstValueFrom(this.http.post(
      `${this.baseUrl}/api/v1/auth/password/reset`, { token, newPassword },
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf }) }
    ));
  }

  async logout(): Promise<void> {
    const csrf = await firstValueFrom(this.http.get<{ token: string }>(
      `${this.baseUrl}/api/v1/auth/csrf`, { withCredentials: true }
    ));
    await firstValueFrom(this.http.post(
      `${this.baseUrl}/api/v1/auth/logout`, {},
      { withCredentials: true, headers: new HttpHeaders({ 'X-XSRF-TOKEN': csrf.token }) }
    ));
    this.accessToken = null;
  }

  async submitInterest(payload: { company: string; segment: string; email: string }): Promise<void> {
    await firstValueFrom(this.http.post(
      `${this.baseUrl}/api/v1/interests`, payload, { withCredentials: true }
    ));
  }

  async me(): Promise<Record<string, unknown>> {
    if (!this.accessToken) await this.refresh();
    return firstValueFrom(this.http.get<Record<string, unknown>>(
      `${this.baseUrl}/api/v1/auth/me`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` }), withCredentials: true }
    ));
  }

  microsoftLoginUrl(): string {
    return `${this.baseUrl}/oauth2/authorization/microsoft`;
  }

  clearLocalSession(): void {
    this.accessToken = null;
  }
}

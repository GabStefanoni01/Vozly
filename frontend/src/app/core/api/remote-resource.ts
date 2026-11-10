import { HttpErrorResponse } from '@angular/common/http';
import { Signal, computed, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * Estado de um recurso carregado da API.
 *
 * - `loading`: requisição em andamento.
 * - `ready`: resposta 2xx recebida.
 * - `not-implemented`: o backend respondeu 404/405/501 — a rota ainda não existe
 *   no Spring Boot. O widget exibe as instruções de implementação.
 * - `offline`: backend inacessível (status 0, 502, 503, 504 — proxy sem destino).
 * - `unauthorized`: 401/403 — autenticação/autorização ainda não configurada ou
 *   sessão expirada (docs/09 §3).
 * - `error`: qualquer outra falha; `traceId` vem do Problem Details quando houver.
 */
export type RemoteStatus = 'loading' | 'ready' | 'not-implemented' | 'offline' | 'unauthorized' | 'error';

export interface RemoteError {
  httpStatus: number;
  code?: string;
  detail?: string;
  traceId?: string;
}

export interface RemoteResource<T> {
  readonly status: Signal<RemoteStatus>;
  readonly data: Signal<T | null>;
  readonly error: Signal<RemoteError | null>;
  readonly isReady: Signal<boolean>;
  reload(): void;
}

export function classifyHttpError(err: unknown): { status: RemoteStatus; error: RemoteError } {
  if (err instanceof HttpErrorResponse) {
    const problem = (err.error && typeof err.error === 'object') ? err.error as Record<string, unknown> : {};
    const error: RemoteError = {
      httpStatus: err.status,
      code: typeof problem['code'] === 'string' ? problem['code'] as string : undefined,
      detail: typeof problem['detail'] === 'string' ? problem['detail'] as string : undefined,
      traceId: typeof problem['traceId'] === 'string' ? problem['traceId'] as string : undefined
    };
    if ([404, 405, 501].includes(err.status)) return { status: 'not-implemented', error };
    if ([0, 502, 503, 504].includes(err.status)) return { status: 'offline', error };
    // 2xx que falhou no parse: a hospedagem estática (ex.: Render com rewrite de SPA)
    // devolveu o index.html no lugar da API — ou seja, não há backend atrás deste host.
    if (err.status >= 200 && err.status < 300) return { status: 'offline', error };
    if ([401, 403].includes(err.status)) return { status: 'unauthorized', error };
    return { status: 'error', error };
  }
  return { status: 'error', error: { httpStatus: -1 } };
}

/**
 * Cria um recurso reativo (signals) a partir de uma fábrica de Observable HTTP.
 * Executa imediatamente e pode ser recarregado com `reload()`.
 */
export function remoteResource<T>(request: () => Observable<T>): RemoteResource<T> {
  const status = signal<RemoteStatus>('loading');
  const data = signal<T | null>(null);
  const error = signal<RemoteError | null>(null);

  let inFlight: Subscription | null = null;

  const load = () => {
    // Cancela a requisição anterior para que uma resposta antiga
    // (ex.: troca rápida de período) não sobrescreva a mais recente.
    inFlight?.unsubscribe();
    status.set('loading');
    error.set(null);
    inFlight = request().subscribe({
      next: value => {
        data.set(value);
        status.set('ready');
      },
      error: err => {
        const classified = classifyHttpError(err);
        data.set(null);
        error.set(classified.error);
        status.set(classified.status);
      }
    });
  };

  load();

  return {
    status: status.asReadonly(),
    data: data.asReadonly(),
    error: error.asReadonly(),
    isReady: computed(() => status() === 'ready'),
    reload: load
  };
}

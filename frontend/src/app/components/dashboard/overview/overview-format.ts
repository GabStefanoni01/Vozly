import { AgentStatus, CallEndReason, CallStatus } from '../../../core/api/dashboard-api.models';

const NUMBER = new Intl.NumberFormat('pt-BR');
const PERCENT = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const DAY_MONTH = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
const DATE_TIME = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const fmtNumber = (value: number) => NUMBER.format(value);
export const fmtPercent = (value: number) => `${PERCENT.format(value)}%`;
export const fmtDayMonth = (iso: string) => DAY_MONTH.format(new Date(iso));
export const fmtDateTime = (iso: string) => DATE_TIME.format(new Date(iso)).replace('.', '');

export function fmtDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null) return '—';
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}min`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** Variação percentual entre períodos; null quando não há base de comparação. */
export function percentDelta(current: number, previous: number | null | undefined): number | null {
  if (previous == null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function fmtPhone(e164: string | null | undefined): string {
  if (!e164) return '—';
  const m = /^\+55(\d{2})(\d{4,5})(\d{4})$/.exec(e164);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164;
}

export const END_REASON_LABEL: Record<CallEndReason, string> = {
  RESOLVED: 'Resolvidas pelo agente',
  TRANSFERRED: 'Transferidas para humano',
  CALLBACK_REQUESTED: 'Retorno solicitado',
  CALLER_HANGUP: 'Encerradas pelo cliente',
  FALLBACK: 'Fallback aplicado',
  FAILED: 'Falhas técnicas'
};

export const CALL_STATUS_META: Record<CallStatus, { label: string; tone: 'green' | 'purple' | 'amber' | 'red' | 'neutral' | 'blue' }> = {
  RECEIVED: { label: 'Recebida', tone: 'neutral' },
  RESOLVING: { label: 'Roteando', tone: 'neutral' },
  RINGING: { label: 'Chamando', tone: 'blue' },
  ACTIVE: { label: 'Em andamento', tone: 'purple' },
  TRANSFERRING: { label: 'Transferindo', tone: 'blue' },
  COMPLETED: { label: 'Concluída', tone: 'green' },
  FAILED: { label: 'Falhou', tone: 'red' },
  REJECTED: { label: 'Rejeitada', tone: 'red' },
  CANCELLED: { label: 'Cancelada', tone: 'neutral' },
  TIMED_OUT: { label: 'Tempo esgotado', tone: 'amber' }
};

export const AGENT_STATUS_META: Record<AgentStatus, { label: string; tone: 'green' | 'purple' | 'amber' | 'neutral' }> = {
  ACTIVE: { label: 'Ativo', tone: 'green' },
  DRAFT: { label: 'Rascunho', tone: 'purple' },
  PAUSED: { label: 'Pausado', tone: 'amber' },
  ARCHIVED: { label: 'Arquivado', tone: 'neutral' }
};

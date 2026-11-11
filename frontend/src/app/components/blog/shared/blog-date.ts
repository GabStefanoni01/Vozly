const FORMAT = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Data curta em português (ex.: "10 de nov. de 2026"). */
export function blogShortDate(iso: string): string {
  return FORMAT.format(new Date(iso));
}

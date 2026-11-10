import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // HttpClient para a API administrativa (/api/v1) e Actuator (/actuator).
    // Quando a autenticação for definida (docs/09 §3), registrar aqui o
    // interceptor de sessão/token com withInterceptors([...]).
    provideHttpClient(withFetch())
  ]
};

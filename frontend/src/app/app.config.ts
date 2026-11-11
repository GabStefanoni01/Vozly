import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // authInterceptor: Bearer token + renovação automática para /api/v1/** do painel.
    provideHttpClient(withInterceptors([authInterceptor]), withInterceptorsFromDi()),
    provideRouter(routes)
  ]
};

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiAuthService } from '../../services/api-auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="login-page">
      <a class="back" routerLink="/">← Início</a>
      <section class="login-card">
        <div class="brand">Vozly <span>AI</span></div>
        <h1>Olá, você voltou!</h1>
        <p class="subtitle">Acesse sua conta para gerenciar suas operações com IA.</p>
        <button class="microsoft" type="button" (click)="loginMicrosoft()" [disabled]="loading">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/>
            <path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#ffb900" d="M13 13h10v10H13z"/>
          </svg>
          Entrar com Microsoft
        </button>
        <div class="divider"><span>ou entre com e-mail</span></div>
        <form (ngSubmit)="submit()">
          <label for="email">E-mail</label>
          <input id="email" name="email" type="email" [(ngModel)]="email" required autocomplete="email">
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" [(ngModel)]="password" required autocomplete="current-password">
          <p *ngIf="message" class="message" role="alert">{{ message }}</p>
          <button class="primary" type="submit" [disabled]="loading">{{ loading ? 'Acessando...' : 'Acessar conta' }}</button>
        </form>
        <p class="footer">Ainda não tem conta? <a routerLink="/register">Criar conta gratuita</a></p>
        <p class="recovery">A recuperação de senha ainda não está disponível.</p>
      </section>
    </main>`,
  styles: [`
    .login-page{min-height:100vh;display:grid;place-items:center;background:radial-gradient(ellipse 60% 45% at 50% 50%,rgba(109,0,255,.22),transparent 70%),#050505;color:#fff;padding:40px 16px;font-family:Inter,sans-serif}
    .back{position:absolute;top:28px;left:28px;color:#c4b5fd;text-decoration:none;font-size:14px}
    .login-card{width:min(100%,440px);box-sizing:border-box;padding:36px;border:1px solid rgba(168,85,247,.25);border-radius:26px;background:rgba(15,12,24,.96);box-shadow:0 30px 80px #000}
    .brand{text-align:center;font-weight:800;font-size:21px;margin-bottom:28px}.brand span{color:#a855f7}
    h1{text-align:center;font-size:27px;margin:0}.subtitle{text-align:center;color:#a1a1aa;font-size:13px;line-height:1.6;margin:10px 0 24px}
    .microsoft{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:13px;border:1px solid #393143;border-radius:30px;background:#17141d;color:white;cursor:pointer;font-size:14px}
    .divider{display:flex;align-items:center;gap:12px;color:#777;font-size:12px;margin:22px 0}.divider:before,.divider:after{content:"";height:1px;flex:1;background:#393143}
    form{display:flex;flex-direction:column;gap:8px}label{font-size:13px;color:#c4b5fd;margin-top:8px}
    input{box-sizing:border-box;width:100%;padding:13px 17px;border:1px solid #393143;border-radius:24px;background:#08070b;color:white;outline:none}
    input:focus{border-color:#a855f7}.primary{margin-top:14px;padding:14px;border:0;border-radius:24px;background:linear-gradient(120deg,#6d00ff,#a855f7);color:white;font-weight:700;cursor:pointer}
    button:disabled{opacity:.65;cursor:wait}.message{color:#fca5a5;font-size:13px;line-height:1.5}
    .footer{text-align:center;color:#a1a1aa;font-size:13px;margin:24px 0 0}.footer a{color:#c4b5fd;text-decoration:none;font-weight:600}
    .recovery{text-align:center;color:#777;font-size:11px;margin:16px 0 0}
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  message: string | null = null;

  constructor(
    private readonly auth: ApiAuthService,
    private readonly router: Router,
    route: ActivatedRoute
  ) {
    if (route.snapshot.queryParamMap.get('error') === 'microsoft_sso_failed') {
      this.message = 'Não foi possível entrar com a Microsoft. Tente novamente ou use seu e-mail e senha.';
    }
  }

  async submit(): Promise<void> {
    this.message = null;
    this.loading = true;
    try {
      await this.auth.login(this.email.trim(), this.password);
      await this.router.navigateByUrl('/');
    } catch {
      this.message = 'Não foi possível entrar. Confira seu e-mail e senha e tente novamente.';
    } finally {
      this.loading = false;
    }
  }

  loginMicrosoft(): void {
    window.location.assign(this.auth.microsoftLoginUrl());
  }
}

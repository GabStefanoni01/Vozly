import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiAuthService } from '../../services/api-auth.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <a routerLink="/login" class="back">← Voltar para entrar</a>
      <section class="auth-card">
        <h1>Esqueceu sua senha?</h1>
        <p>Informe o e-mail da sua conta. Se ele estiver cadastrado, enviaremos um link para criar uma nova senha.</p>
        <form (ngSubmit)="submit()">
          <label for="email">E-mail</label>
          <input id="email" name="email" type="email" [(ngModel)]="email" required maxlength="320" autocomplete="email" placeholder="voce@empresa.com">
          <p *ngIf="message" class="success" role="status">{{ message }}</p>
          <p *ngIf="error" class="error" role="alert">{{ error }}</p>
          <button type="submit" [disabled]="loading">{{ loading ? 'Enviando...' : 'Enviar link de recuperação' }}</button>
        </form>
        <a routerLink="/login" class="login-link">Voltar para o login</a>
      </section>
    </main>
  `,
  styles: [`
    :host{display:block}.auth-page{min-height:100vh;display:grid;place-items:center;padding:32px 18px;background:#050505;color:#fff;font-family:Inter,sans-serif}
    .back{position:absolute;top:28px;left:28px;color:#c4b5fd;text-decoration:none;font-size:14px}
    .auth-card{width:min(100%,440px);box-sizing:border-box;padding:36px;border:1px solid #35234f;border-radius:24px;background:#100d18;box-shadow:0 24px 80px #000}
    h1{margin:0 0 10px;font-size:26px}.auth-card>p{color:#a1a1aa;font-size:14px;line-height:1.6}
    form{display:flex;flex-direction:column;gap:10px;margin-top:26px}label{color:#c4b5fd;font-size:13px}
    input{box-sizing:border-box;width:100%;padding:13px 16px;border:1px solid #393143;border-radius:12px;background:#08070b;color:#fff}
    button{margin-top:10px;padding:14px;border:0;border-radius:24px;background:linear-gradient(120deg,#6d00ff,#a855f7);color:#fff;font-weight:700;cursor:pointer}
    button:disabled{opacity:.6;cursor:wait}.success{color:#86efac!important;font-size:13px}.error{color:#fca5a5;font-size:13px}
    .login-link{display:block;text-align:center;margin-top:22px;color:#c4b5fd;text-decoration:none;font-size:13px}
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private readonly auth: ApiAuthService) {}

  async submit(): Promise<void> {
    this.loading = true;
    this.message = null;
    this.error = null;
    try {
      await this.auth.requestPasswordReset(this.email.trim());
      this.message = 'Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes.';
    } catch {
      this.error = 'Não foi possível processar a solicitação agora. Tente novamente mais tarde.';
    } finally {
      this.loading = false;
    }
  }
}

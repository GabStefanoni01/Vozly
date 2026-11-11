import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiAuthService } from '../../services/api-auth.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <a routerLink="/login" class="back">← Voltar para entrar</a>
      <section class="auth-card">
        <h1>Crie uma nova senha</h1>
        <p>Escolha uma senha forte com pelo menos 12 caracteres.</p>
        <form *ngIf="token; else invalidLink" (ngSubmit)="submit()">
          <label for="password">Nova senha</label>
          <input id="password" name="password" type="password" [(ngModel)]="password" required minlength="12" maxlength="128" autocomplete="new-password">
          <label for="confirmation">Confirme a nova senha</label>
          <input id="confirmation" name="confirmation" type="password" [(ngModel)]="confirmation" required minlength="12" maxlength="128" autocomplete="new-password">
          <p *ngIf="error" class="error" role="alert">{{ error }}</p>
          <p *ngIf="success" class="success" role="status">{{ success }}</p>
          <button type="submit" [disabled]="loading || !!success">{{ loading ? 'Salvando...' : 'Redefinir senha' }}</button>
        </form>
        <ng-template #invalidLink>
          <p class="error">Este link não é válido. Solicite uma nova recuperação de senha.</p>
        </ng-template>
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
export class ResetPasswordComponent {
  readonly token: string;
  password = '';
  confirmation = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(route: ActivatedRoute, private readonly auth: ApiAuthService, private readonly router: Router) {
    this.token = route.snapshot.queryParamMap.get('token') ?? '';
  }

  async submit(): Promise<void> {
    this.error = null;
    if (this.password.length < 12 || this.password.length > 128) {
      this.error = 'A senha deve ter entre 12 e 128 caracteres.';
      return;
    }
    if (this.password !== this.confirmation) {
      this.error = 'As senhas não coincidem.';
      return;
    }
    this.loading = true;
    try {
      await this.auth.resetPassword(this.token, this.password);
      this.success = 'Senha redefinida com sucesso. Você já pode entrar com a nova senha.';
      this.password = '';
      this.confirmation = '';
    } catch (error: any) {
      this.error = error?.error?.detail || 'Este link é inválido ou expirou. Solicite uma nova recuperação.';
    } finally {
      this.loading = false;
    }
  }
}

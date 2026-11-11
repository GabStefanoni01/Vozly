import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiAuthService } from '../../services/api-auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="register-page">
      <a routerLink="/">← Início</a>
      <section class="register-card">
        <h1>Crie sua conta Vozly</h1>
        <p>Cadastre sua conta e seu workspace para começar.</p>
        <form (ngSubmit)="submit()">
          <label for="name">Nome</label>
          <input id="name" name="name" [(ngModel)]="name" required maxlength="120" autocomplete="name">
          <label for="email">E-mail</label>
          <input id="email" name="email" type="email" [(ngModel)]="email" required maxlength="320" autocomplete="email">
          <label for="workspace">Nome do workspace</label>
          <input id="workspace" name="workspace" [(ngModel)]="workspaceName" required maxlength="160">
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" [(ngModel)]="password" required minlength="12" maxlength="128" autocomplete="new-password">
          <p class="hint">A senha deve ter entre 12 e 128 caracteres.</p>
          <p *ngIf="error" class="error" role="alert">{{ error }}</p>
          <button type="submit" [disabled]="loading">{{ loading ? 'Criando conta...' : 'Criar conta' }}</button>
        </form>
        <p class="footer">Já tem uma conta? <a routerLink="/login">Entrar</a></p>
      </section>
    </main>`,
  styles: [`
    .register-page{min-height:100vh;display:grid;place-items:center;background:#050505;color:#fff;padding:32px;font-family:Inter,sans-serif}
    .register-page>a{position:absolute;top:28px;left:28px;color:#c4b5fd;text-decoration:none}
    .register-card{width:min(100%,440px);padding:36px;border:1px solid #35234f;border-radius:24px;background:#100d18;box-shadow:0 24px 80px #000}
    h1{margin:0 0 8px;font-size:26px}.register-card>p,.hint{color:#a1a1aa;font-size:13px;line-height:1.5}
    form{display:flex;flex-direction:column;gap:8px;margin-top:24px}label{margin-top:8px;color:#c4b5fd;font-size:13px}
    input{box-sizing:border-box;width:100%;padding:13px 16px;border:1px solid #393143;border-radius:12px;background:#08070b;color:white}
    button{margin-top:16px;padding:14px;border:0;border-radius:24px;background:linear-gradient(120deg,#6d00ff,#a855f7);color:white;font-weight:700;cursor:pointer}
    button:disabled{opacity:.6}.error{color:#fca5a5;font-size:13px}.footer{text-align:center;margin-top:24px}.footer a{color:#c4b5fd}
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  workspaceName = '';
  loading = false;
  error: string | null = null;

  constructor(private readonly auth: ApiAuthService, private readonly router: Router) {}

  async submit(): Promise<void> {
    this.error = null;
    this.loading = true;
    try {
      await this.auth.register({
        name: this.name.trim(),
        email: this.email.trim(),
        password: this.password,
        workspaceName: this.workspaceName.trim()
      });
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.error = 'Não foi possível criar sua conta. Confira os dados e tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiAuthService } from '../../services/api-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="la-tela">
      <!-- Fundo Atmosférico Minimalista com Brilho Radial Violeta Oficial Vozly (Sem banner) -->
      <div class="la-fundo" aria-hidden="true"></div>

      <!-- Botão Voltar para o Início no Canto Superior Esquerdo -->
      <a routerLink="/" class="la-voltar-inicio" aria-label="Voltar para a página inicial">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Início</span>
      </a>

      <div class="la-coluna">
        <!-- Marca Oficial Vozly -->
        <div class="la-marca">
          <img src="brand/vozly-app-icon.png" alt="Vozly" width="40" height="40" class="la-marca-icon" />
          <span class="la-marca-texto">
            Vozly <span class="la-destaque">AI</span>
          </span>
        </div>

        <div class="la-cena">
          <!-- 3 Anéis Fluidos com Animação Morphing e Brilho Neon Violeta -->
          <span class="la-anel anel-1" aria-hidden="true"></span>
          <span class="la-anel anel-2" aria-hidden="true"></span>
          <span class="la-anel anel-3" aria-hidden="true"></span>

          <!-- Cartão Interativo com Efeito de Brilho que Segue o Mouse -->
          <div #cartao (pointermove)="moverBrilho($event)" class="la-cartao">
            <div class="la-cabecalho">
              <h1>Olá, você voltou!</h1>
              <p>Estamos felizes em te ver novamente. Acesse para gerenciar suas operações telefônicas com IA.</p>
            </div>

            <!-- Botão de Login Social com Microsoft -->
            <button type="button" class="la-btn-google" (click)="entrarComMicrosoft()">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              <span>Entrar com Microsoft</span>
            </button>

            <!-- Divisor -->
            <div class="la-divisor">
              <span>ou entre com e-mail</span>
            </div>

            <!-- Formulário Demonstrativo -->
            <form (ngSubmit)="enviar()" class="la-form">
              <label for="la-email">E-mail</label>
              <input
                id="la-email"
                type="email"
                name="email"
                required
                autocomplete="email"
                [(ngModel)]="email"
                placeholder="seuemail@empresa.com.br"
              />

              <label for="la-senha">Senha</label>
              <div class="la-senha">
                <input
                  id="la-senha"
                  [type]="mostrarSenha ? 'text' : 'password'"
                  name="senha"
                  required
                  autocomplete="current-password"
                  [(ngModel)]="senha"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  (click)="toggleMostrarSenha()"
                  [attr.aria-label]="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
                  class="la-senha-toggle"
                >
                  {{ mostrarSenha ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>

              <a class="la-link la-esqueci" href="javascript:void(0)" (click)="esqueciSenha()">
                Esqueci minha senha
              </a>

              <!-- Mensagem de Alerta/Status -->
              <div *ngIf="mensagem" [class]="tipoMensagem === 'sucesso' ? 'la-sucesso' : 'la-erro'" role="alert">
                {{ mensagem }}
              </div>

              <button type="submit" [disabled]="carregando" class="la-botao">
                <span *ngIf="!carregando">Acessar conta</span>
                <span *ngIf="carregando" class="la-loading">
                  <span class="la-spinner"></span>
                  Acessando...
                </span>
              </button>
            </form>

            <p class="la-rodape">
              Ainda não tem conta?
              <a class="la-link" href="javascript:void(0)" (click)="criarConta()">Criar conta gratuita</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    /* ==========================================================================
       BRANDING VOZLY: Adaptado da identidade visual oficial (#050505, #6D00FF)
       ========================================================================== */
    :host {
      --la-cor-1: #A855F7;            /* roxo claro para anel 1, destaques, foco */
      --la-cor-2: #8B3DFF;            /* violeta secundário para anel 2 e botão */
      --la-cor-3: #6D00FF;            /* roxo profundo para anel 3 */
      --la-fundo: #050505;
      --la-brilho-fundo: rgba(109, 0, 255, 0.24);
      --la-cartao-1: rgba(15, 12, 24, 0.94);
      --la-cartao-2: rgba(8, 6, 14, 0.98);
      --la-texto: #FFFFFF;
      --la-texto-suave: #A1A1AA;
      --la-texto-botao: #FFFFFF;
      --la-fonte-titulo: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      display: block;
    }

    .la-tela {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: var(--la-fundo);
      padding: 48px 16px;
      color: var(--la-texto);
    }

    /* Botão Voltar para Início */
    .la-voltar-inicio {
      position: absolute;
      top: 28px;
      left: 28px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--la-texto-suave);
      text-decoration: none;
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      backdrop-filter: blur(12px);
      transition: all var(--transition-fast, 150ms ease);
      z-index: 10;
    }

    .la-voltar-inicio:hover {
      color: #FFFFFF;
      background: rgba(109, 0, 255, 0.15);
      border-color: rgba(168, 85, 247, 0.35);
      transform: translateX(-2px);
    }

    /* Fundo com Brilho Radial Puro & Minimalista */
    .la-fundo {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(ellipse 60% 45% at 50% 50%, var(--la-brilho-fundo), transparent 70%), var(--la-fundo);
      z-index: 0;
    }

    .la-coluna {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 448px;
    }

    /* Marca Oficial Vozly */
    .la-marca {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 28px;
      font-family: var(--la-fonte-titulo);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .la-marca-icon {
      border-radius: 10px;
      filter: drop-shadow(0 0 16px rgba(109, 0, 255, 0.6));
    }

    .la-destaque {
      color: var(--la-cor-1);
    }

    /* Cena e Anéis Orbitando o Cartão */
    .la-cena {
      position: relative;
      isolation: isolate;
    }

    /* Anel Base: dimensões fiéis, rotação garantida por transform */
    .la-anel {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: -1;
      width: calc(100% + 72px);
      aspect-ratio: 1;
      margin: calc((100% + 72px) / -2) 0 0 calc((100% + 72px) / -2);
      border: 2px solid var(--la-cor-1);
      color: var(--la-cor-1);
      opacity: 0.6;
      pointer-events: none;
      transform-origin: 50% 50%;
      transform: rotate(0deg);
      will-change: transform;
      transition: opacity 0.4s ease, box-shadow 0.4s ease, border-width 0.4s ease;
    }

    .la-anel.anel-1 {
      border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
      animation: la-giro 12s linear infinite;
    }

    .la-anel.anel-2 {
      border-radius: 41% 44% 56% 59% / 38% 62% 63% 37%;
      border-color: var(--la-cor-2);
      color: var(--la-cor-2);
      animation: la-giro 8s linear infinite;
    }

    .la-anel.anel-3 {
      border-radius: 41% 44% 56% 59% / 38% 62% 63% 37%;
      border-color: var(--la-cor-3);
      color: var(--la-cor-3);
      animation: la-giro-reverso 14s linear infinite;
    }

    /* Brilho Intenso dos Anéis ao Focar ou Passar o Mouse no Cartão */
    .la-cena:hover .la-anel,
    .la-cena:focus-within .la-anel {
      opacity: 1;
      border-width: 3px;
      box-shadow: 0 0 18px currentColor, inset 0 0 12px currentColor;
    }

    @keyframes la-giro {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes la-giro-reverso {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(-360deg);
      }
    }

    @media (max-width: 640px) {
      .la-anel {
        width: calc(100% + 32px);
        margin: calc((100% + 32px) / -2) 0 0 calc((100% + 32px) / -2);
        border-width: 1.5px;
        opacity: 0.5;
      }
      .la-cena:hover .la-anel,
      .la-cena:focus-within .la-anel {
        border-width: 2px;
        box-shadow: 0 0 12px currentColor;
      }
    }

    /* Cartão Escuro com Efeito de Luz Mouse Tracker */
    .la-cartao {
      position: relative;
      overflow: hidden;
      border-radius: 28px;
      padding: 36px;
      background: linear-gradient(160deg, var(--la-cartao-1), var(--la-cartao-2));
      border: 1px solid rgba(168, 85, 247, 0.2);
      box-shadow: 0 30px 80px -40px rgba(0, 0, 0, 0.95), 0 0 30px rgba(109, 0, 255, 0.1), inset 0 1px 0 rgba(168, 85, 247, 0.12);
    }

    .la-cartao::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.35s ease;
      background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(168, 85, 247, 0.12), transparent 60%);
    }

    .la-cena:hover .la-cartao::before,
    .la-cena:focus-within .la-cartao::before {
      opacity: 1;
    }

    @media (max-width: 640px) {
      .la-cartao {
        padding: 28px 24px;
      }
    }

    /* Cabeçalho do Cartão */
    .la-cabecalho {
      margin-bottom: 24px;
      text-align: center;
    }

    .la-cabecalho h1 {
      margin: 0;
      font-family: var(--la-fonte-titulo);
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }

    .la-cabecalho p {
      margin: 8px 0 0;
      font-size: 13.5px;
      line-height: 1.6;
      color: var(--la-texto-suave);
    }

    /* Botão Social Google */
    .la-btn-google {
      width: 100%;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 20px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast, 150ms ease);
    }

    .la-btn-google:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(168, 85, 247, 0.35);
      transform: translateY(-1px);
    }

    /* Divisor */
    .la-divisor {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 20px 0;
      font-size: 12px;
      color: rgba(221, 230, 234, 0.4);
    }

    .la-divisor::before,
    .la-divisor::after {
      content: "";
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Formulário */
    .la-form {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .la-form label {
      margin-top: 10px;
      font-size: 13px;
      font-weight: 500;
      color: var(--la-texto-suave);
    }

    .la-form input {
      width: 100%;
      box-sizing: border-box;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(5, 5, 8, 0.7);
      padding: 12px 20px;
      font-size: 14px;
      color: var(--la-texto);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .la-form input::placeholder {
      color: rgba(221, 230, 234, 0.3);
    }

    .la-form input:focus {
      border-color: var(--la-cor-1);
      box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.25);
    }

    .la-senha {
      position: relative;
    }

    .la-senha input {
      padding-right: 84px;
    }

    .la-senha-toggle {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: 0;
      cursor: pointer;
      font-size: 12px;
      color: var(--la-texto-suave);
      padding: 4px;
      transition: color 0.15s;
    }

    .la-senha-toggle:hover {
      color: #FFFFFF;
    }

    .la-link {
      color: var(--la-cor-1);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s;
    }

    .la-link:hover {
      color: #D8B4FE;
    }

    .la-esqueci {
      align-self: flex-end;
      font-size: 12px;
      font-weight: 400;
      margin-top: 4px;
    }

    .la-erro {
      margin: 10px 0 0;
      border-radius: 8px;
      border: 1px solid rgba(239, 68, 68, 0.35);
      background: rgba(239, 68, 68, 0.12);
      padding: 10px 14px;
      font-size: 13px;
      color: #FCA5A5;
      line-height: 1.4;
    }

    .la-sucesso {
      margin: 10px 0 0;
      border-radius: 8px;
      border: 1px solid rgba(34, 197, 94, 0.35);
      background: rgba(34, 197, 94, 0.12);
      padding: 10px 14px;
      font-size: 13px;
      color: #86EFAC;
      line-height: 1.4;
    }

    /* Botão Principal com Gradiente Violeta Oficial Vozly */
    .la-botao {
      margin-top: 16px;
      border: 0;
      border-radius: 999px;
      padding: 13px 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      color: var(--la-texto-botao);
      background: linear-gradient(120deg, var(--la-cor-3) 0%, var(--la-cor-2) 50%, var(--la-cor-1) 100%);
      box-shadow: 0 4px 24px rgba(109, 0, 255, 0.45);
      transition: filter 0.2s, box-shadow 0.2s, transform 0.15s;
    }

    .la-botao:hover {
      filter: brightness(1.12);
      box-shadow: 0 6px 32px rgba(139, 61, 255, 0.65);
      transform: translateY(-1px);
    }

    .la-botao:disabled {
      cursor: not-allowed;
      opacity: 0.7;
      transform: none;
    }

    .la-loading {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .la-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .la-rodape {
      margin: 24px 0 0;
      text-align: center;
      font-size: 13.5px;
      color: var(--la-texto-suave);
    }
  `]
})
export class LoginComponent {
  @ViewChild('cartao') cartaoRef!: ElementRef<HTMLDivElement>;

  email = '';
  senha = '';
  mostrarSenha = false;
  carregando = false;
  mensagem: string | null = null;
  tipoMensagem: 'erro' | 'sucesso' = 'erro';

  constructor(private router: Router, private auth: ApiAuthService, route: ActivatedRoute) {
    if (route.snapshot.queryParamMap.get('error') === 'microsoft_sso_failed') {
      this.tipoMensagem = 'erro';
      this.mensagem = 'Não foi possível entrar com a Microsoft. Tente novamente ou use seu e-mail e senha.';
    }
  }

  moverBrilho(e: PointerEvent): void {
    const el = this.cartaoRef?.nativeElement;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async enviar(): Promise<void> {
    this.mensagem = null;
    this.carregando = true;
    try {
      await this.auth.login(this.email.trim(), this.senha);
      await this.router.navigate(['/']);
    } catch {
      this.tipoMensagem = 'erro';
      this.mensagem = 'Não foi possível entrar. Confira seu e-mail e senha e tente novamente.';
    } finally {
      this.carregando = false;
    }
  }

  entrarComMicrosoft(): void {
    window.location.assign(this.auth.microsoftLoginUrl());
  }

  esqueciSenha(): void {
    this.tipoMensagem = 'sucesso';
    this.mensagem = 'Fluxo de recuperação de senha será ativado na fase de autenticação.';
  }

  criarConta(): void {
    this.router.navigate(['/register']);
  }
}

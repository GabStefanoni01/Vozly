import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-blog-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="newsletter-card">
      <div class="glow-orb"></div>
      
      <div class="newsletter-content">
        <div class="badge-row">
          <span class="news-badge">
            <app-icon name="sparkles" [size]="14" color="#A855F7"></app-icon>
            Vozly Radar
          </span>
        </div>

        <h3 class="newsletter-title">
          Receba nossos ensaios de engenharia & IA quinzenalmente
        </h3>

        <p class="newsletter-desc">
          Sem spam, sem jargões vazios. Apenas discussões aprofundadas sobre arquitetura de voz, modelos de baixa latência e telecomunicações em nuvem.
        </p>

        <form *ngIf="!subscribed" (ngSubmit)="onSubscribe()" class="newsletter-form">
          <div class="input-group">
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="seu.email@empresa.com.br"
              required
              class="email-input"
              aria-label="Email corporativo para inscrição"
            />
            <button type="submit" class="submit-btn" [disabled]="!email">
              <span>Inscrever-se</span>
              <app-icon name="arrow-right" [size]="15" color="#FFFFFF"></app-icon>
            </button>
          </div>
          <span class="privacy-note">
            Respeitamos sua privacidade. Cancele a assinatura quando desejar.
          </span>
        </form>

        <div *ngIf="subscribed" class="success-message">
          <app-icon name="check-circle" [size]="20" color="#22C55E"></app-icon>
          <span>Inscrição confirmada com sucesso! Bem-vindo ao Vozly Insights.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .newsletter-card {
      position: relative;
      background: radial-gradient(circle at 100% 0%, rgba(109, 0, 255, 0.2) 0%, rgba(16, 14, 24, 0.95) 70%);
      border: 1px solid rgba(168, 85, 247, 0.32);
      border-radius: 20px;
      padding: 40px 32px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    @media (min-width: 768px) {
      .newsletter-card {
        padding: 48px 48px;
      }
    }

    .glow-orb {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 240px;
      height: 240px;
      background: rgba(139, 61, 255, 0.25);
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
    }

    .newsletter-content {
      position: relative;
      z-index: 2;
      max-width: 600px;
    }

    .badge-row {
      margin-bottom: 16px;
    }

    .news-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #C084FC;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
    }

    .newsletter-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: clamp(20px, 3vw, 28px);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.25;
      color: #FFFFFF;
      margin: 0 0 12px;
    }

    .newsletter-desc {
      font-family: var(--font-sans, 'Inter', sans-serif);
      font-size: 14.5px;
      color: #A1A1AA;
      line-height: 1.6;
      margin: 0 0 24px;
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    @media (min-width: 640px) {
      .input-group {
        flex-direction: row;
      }
    }

    .email-input {
      flex: 1;
      height: 48px;
      background: rgba(8, 8, 12, 0.85);
      border: 1px solid rgba(168, 85, 247, 0.25);
      border-radius: 10px;
      padding: 0 16px;
      font-size: 14px;
      color: #FFFFFF;
      outline: none;
      transition: all 0.2s ease;
    }

    .email-input:focus {
      border-color: #A855F7;
      box-shadow: 0 0 16px rgba(168, 85, 247, 0.3);
    }

    .email-input::placeholder {
      color: #71717A;
    }

    .submit-btn {
      height: 48px;
      padding: 0 24px;
      background: linear-gradient(135deg, #6D00FF 0%, #A855F7 100%);
      color: #FFFFFF;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(109, 0, 255, 0.35);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(168, 85, 247, 0.45);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .privacy-note {
      font-size: 11.5px;
      color: #71717A;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 10px;
      color: #86EFAC;
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class BlogNewsletterComponent {
  public email: string = '';
  public subscribed: boolean = false;

  public onSubscribe(): void {
    if (this.email && this.email.includes('@')) {
      this.subscribed = true;
    }
  }
}

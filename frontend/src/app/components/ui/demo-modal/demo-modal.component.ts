import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { ApiAuthService } from '../../../services/api-auth.service';

@Component({
  selector: 'app-demo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div *ngIf="isOpen" class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-card" role="dialog" aria-modal="true">
        <!-- Close button -->
        <button class="modal-close" (click)="close()" aria-label="Fechar modal">
          <app-icon name="x" [size]="20"></app-icon>
        </button>

        <!-- Brand Icon -->
        <div class="modal-badge-wrapper">
          <img src="brand/vozly-symbol-orbit-tight.png" alt="Símbolo Vozly" class="modal-brand-symbol">
        </div>

        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-desc">{{ description }}</p>
        </div>

        <!-- Success Message -->
        <div *ngIf="submitted" class="success-box">
          <div class="success-icon">
            <app-icon name="check" [size]="24" color="#22C55E"></app-icon>
          </div>
          <h4>Interesse registrado com sucesso!</h4>
          <p>
            Obrigado pelo seu interesse na Vozly. Em breve compartilharemos novidades sobre o lançamento da plataforma.
          </p>
          <button class="btn btn-secondary btn-sm" (click)="resetAndClose()">Fechar</button>
        </div>

        <!-- Demo Form -->
        <form *ngIf="!submitted" (ngSubmit)="submitForm()" class="modal-form">
          <div class="form-group">
            <label for="companyName">Nome da sua empresa</label>
            <input
              id="companyName"
              type="text"
              maxlength="160"
              name="companyName"
              [(ngModel)]="formData.company"
              placeholder="Ex.: Assistência Técnica Silva ou Clínica Viva"
              required
            />
          </div>

          <div class="form-group">
            <label for="segment">Segmento de atuação</label>
            <select id="segment" name="segment" [(ngModel)]="formData.segment">
              <option value="assistencia">Assistência Técnica</option>
              <option value="clinica">Clínica / Consultório</option>
              <option value="oficina">Oficina Mecânica</option>
              <option value="manutencao">Empresa de Manutenção</option>
              <option value="servicos">Prestador de Serviços</option>
              <option value="outros">Outro Segmento Comercial</option>
            </select>
          </div>

          <div class="form-group">
            <label for="userEmail">E-mail para contato</label>
            <input
              id="userEmail"
              type="email"
              maxlength="320"
              name="userEmail"
              [(ngModel)]="formData.email"
              placeholder="seuemail@empresa.com.br"
              required
            />
          </div>

          <p *ngIf="error" class="form-error" role="alert">{{ error }}</p>

          <div class="disclaimer-note">
            <app-icon name="alert-circle" [size]="16" color="#A855F7"></app-icon>
            <span>
              Seus dados serão enviados à Vozly para registrar seu interesse na plataforma.
            </span>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary" [disabled]="loading || !formData.company || !formData.email">
              {{ loading ? 'Enviando...' : 'Registrar Interesse' }}
              <app-icon name="arrow-right" [size]="16"></app-icon>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      animation: fadeIn 200ms ease-out;
    }

    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-highlight);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(109, 0, 255, 0.25);
      border-radius: var(--radius-xl);
      max-width: 500px;
      width: 100%;
      padding: 36px;
      position: relative;
      animation: scaleUp 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      transition: all var(--transition-fast);
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .modal-badge-wrapper {
      margin-bottom: 20px;
    }

    .modal-brand-symbol {
      width: 44px;
      height: 44px;
      object-fit: contain;
      filter: drop-shadow(0 0 16px rgba(109, 0, 255, 0.5));
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      background: rgba(109, 0, 255, 0.12);
      border: 1px solid var(--purple-border);
      border-radius: var(--radius-pill);
      font-size: 12px;
      color: var(--light-purple);
      margin-bottom: 12px;
      font-weight: 500;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background: var(--light-purple);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--light-purple);
      animation: pulse 1.5s infinite;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #FFFFFF;
    }

    .modal-desc {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-group input,
    .form-group select {
      background: rgba(11, 11, 15, 0.9);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      color: #FFFFFF;
      font-family: var(--font-sans);
      font-size: 14px;
      outline: none;
      transition: border-color var(--transition-fast);
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: var(--light-purple);
      box-shadow: 0 0 0 3px rgba(109, 0, 255, 0.2);
    }

    .disclaimer-note {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: rgba(109, 0, 255, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
      padding: 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

.form-error { color: #FCA5A5; font-size: 13px; line-height: 1.4; }

    .modal-actions {
      margin-top: 8px;
    }

    .modal-actions .btn {
      width: 100%;
    }

    .success-box {
      text-align: center;
      padding: 24px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    .success-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success-box h4 {
      font-size: 18px;
      color: #fff;
    }

    .success-box p {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `]
})
export class DemoModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Conhecer a Proposta da Vozly';
  @Input() description = 'Demonstração do conceito de agente de inteligência artificial aplicada ao atendimento telefônico e automação comercial.';
  @Output() closeEvent = new EventEmitter<void>();

  submitted = false;
  loading = false;
  error: string | null = null;
  formData = {
    company: '',
    segment: 'assistencia',
    email: ''
  };

  constructor(private readonly api: ApiAuthService) {}

  close(): void {
    this.closeEvent.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  async submitForm(): Promise<void> {
    this.error = null;
    this.loading = true;
    try {
      await this.api.submitInterest({
        company: this.formData.company.trim(),
        segment: this.formData.segment,
        email: this.formData.email.trim()
      });
      this.submitted = true;
    } catch {
      this.error = 'Não foi possível registrar seu interesse. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }

  resetAndClose(): void {
    this.submitted = false;
    this.error = null;
    this.formData = { company: '', segment: 'assistencia', email: '' };
    this.close();
  }
}

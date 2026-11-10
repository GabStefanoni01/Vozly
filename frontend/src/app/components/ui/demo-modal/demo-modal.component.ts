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
        <button class="modal-close" type="button" (click)="close()" aria-label="Fechar modal"><app-icon name="x" [size]="20"></app-icon></button>
        <div class="modal-badge-wrapper"><img src="brand/vozly-symbol-orbit-tight.png" alt="Símbolo Vozly" class="modal-brand-symbol"></div>
        <div class="modal-header"><h3 class="modal-title">{{ title }}</h3><p class="modal-desc">{{ description }}</p></div>
        <div *ngIf="submitted" class="success-box">
          <div class="success-icon"><app-icon name="check" [size]="24" color="#22C55E"></app-icon></div>
          <h4>Interesse registrado com sucesso!</h4>
          <p>Obrigado pelo seu interesse na Vozly. Em breve compartilharemos novidades sobre o lançamento da plataforma.</p>
          <button class="btn btn-secondary btn-sm" type="button" (click)="resetAndClose()">Fechar</button>
        </div>
        <form *ngIf="!submitted" (ngSubmit)="submitForm()" class="modal-form">
          <div class="form-group"><label for="companyName">Nome da sua empresa</label><input id="companyName" type="text" name="companyName" [(ngModel)]="formData.company" placeholder="Ex.: Assistência Técnica Silva ou Clínica Viva" required></div>
          <div class="form-group"><label for="segment">Segmento de atuação</label><select id="segment" name="segment" [(ngModel)]="formData.segment" required>
            <option value="assistencia">Assistência Técnica</option><option value="clinica">Clínica / Consultório</option><option value="oficina">Oficina Mecânica</option><option value="manutencao">Empresa de Manutenção</option><option value="servicos">Prestador de Serviços</option><option value="outros">Outro Segmento Comercial</option>
          </select></div>
          <div class="form-group"><label for="userEmail">E-mail para contato</label><input id="userEmail" type="email" name="userEmail" [(ngModel)]="formData.email" placeholder="seuemail@empresa.com.br" required></div>
          <p *ngIf="error" class="form-error" role="alert">{{ error }}</p>
          <div class="disclaimer-note"><app-icon name="alert-circle" [size]="16" color="#A855F7"></app-icon><span>Seus dados serão usados para registrar seu interesse na Vozly.</span></div>
          <div class="modal-actions"><button type="submit" class="btn btn-primary" [disabled]="loading || !formData.company || !formData.email">{{ loading ? 'Enviando...' : 'Registrar Interesse' }}<app-icon name="arrow-right" [size]="16"></app-icon></button></div>
        </form>
      </div>
    </div>`,
  styles: [`
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px}
    .modal-card{background:var(--bg-card);border:1px solid var(--border-highlight);box-shadow:0 25px 60px #000,0 0 35px rgba(109,0,255,.25);border-radius:var(--radius-xl);max-width:500px;width:100%;padding:36px;position:relative}
    .modal-close{position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.05);color:var(--text-secondary);border:1px solid var(--border-subtle)}
    .modal-badge-wrapper{margin-bottom:20px}.modal-brand-symbol{width:44px;height:44px;object-fit:contain}
    .modal-title{font-size:24px;font-weight:700;margin-bottom:8px;color:#fff}.modal-desc{font-size:14px;color:var(--text-secondary);line-height:1.5;margin-bottom:24px}
    .modal-form{display:flex;flex-direction:column;gap:16px}.form-group{display:flex;flex-direction:column;gap:6px}.form-group label{font-size:13px;color:var(--text-secondary)}
    .form-group input,.form-group select{background:rgba(11,11,15,.9);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:12px 14px;color:#fff;font:14px var(--font-sans)}
    .disclaimer-note{display:flex;gap:10px;background:rgba(109,0,255,.08);border:1px solid rgba(168,85,247,.2);padding:12px;border-radius:var(--radius-sm);font-size:12px;color:var(--text-secondary)}
    .modal-actions{margin-top:8px}.modal-actions .btn{width:100%}.success-box{text-align:center;padding:24px 12px;display:flex;flex-direction:column;align-items:center;gap:14px}
    .success-icon{width:52px;height:52px;border-radius:50%;background:rgba(34,197,94,.15);display:flex;align-items:center;justify-content:center}.success-box h4{font-size:18px;color:#fff}.success-box p{font-size:14px;color:var(--text-secondary);line-height:1.5}
    .form-error{color:#fca5a5;font-size:13px}
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
  formData = { company: '', segment: 'assistencia', email: '' };

  constructor(private readonly api: ApiAuthService) {}

  close(): void { this.closeEvent.emit(); }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) this.close();
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

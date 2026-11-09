import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <footer class="site-footer">
      <div class="container footer-container">
        <!-- Coluna 1: Marca & Descrição Institucional -->
        <div class="footer-brand-col">
          <a href="#" class="footer-brand-link" aria-label="Vozly Início">
            <img
              src="brand/vozly-logo-horizontal.png"
              alt="Vozly"
              class="footer-brand-logo"
            />
          </a>
          <p class="footer-tagline">
            Vozly — Inteligência artificial aplicada ao atendimento telefônico.
          </p>
          <div class="footer-status-tag">
            <span class="status-indicator"></span>
            <span>Estágio: Desenvolvimento Frontend</span>
          </div>
        </div>

        <!-- Colunas de Navegação Estruturada -->
        <div class="footer-nav-grid">
          <!-- Coluna: Produto -->
          <div class="footer-nav-col">
            <span class="nav-heading">Produto</span>
            <ul class="footer-links">
              <li><a href="#como-funciona">Como funciona</a></li>
              <li><a href="#demonstracao">Demonstração da Chamada</a></li>
              <li><a href="#recursos">Recursos principais</a></li>
              <li><a href="#painel">Painel de controle</a></li>
            </ul>
          </div>

          <!-- Coluna: Aplicações -->
          <div class="footer-nav-col">
            <span class="nav-heading">Aplicações</span>
            <ul class="footer-links">
              <li><a href="#aplicacoes">Assistências técnicas</a></li>
              <li><a href="#aplicacoes">Clínicas e consultórios</a></li>
              <li><a href="#aplicacoes">Oficinas mecânicas</a></li>
              <li><a href="#aplicacoes">Prestadores de serviços</a></li>
            </ul>
          </div>

          <!-- Coluna: Arquitetura & Governança -->
          <div class="footer-nav-col">
            <span class="nav-heading">Tecnologia</span>
            <ul class="footer-links">
              <li><a href="#integracoes">Ecossistema de integrações</a></li>
              <li><a href="#seguranca">Governança & segurança</a></li>
              <li><a href="#seguranca">Privacidade e dados</a></li>
              <li>
                <button class="footer-btn-link" (click)="onOpenRoadmap()">
                  <span>Visão do Roadmap</span>
                  <app-icon name="arrow-right" [size]="12" color="#A855F7"></app-icon>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Barra Inferior de Direitos -->
      <div class="footer-bottom">
        <div class="container bottom-container">
          <p class="copyright-text">
            © {{ currentYear }} Vozly. Todos os direitos reservados. Interfaces demonstrativas preparadas para integração futura.
          </p>
          <div class="bottom-badges">
            <span class="mono-badge">AI Voice Agent Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: #08080C;
      border-top: 1px solid var(--border-subtle);
      padding-top: 64px;
      position: relative;
      z-index: 2;
    }

    .footer-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      padding-bottom: 56px;
    }

    @media (min-width: 900px) {
      .footer-container {
        grid-template-columns: 1.2fr 2fr;
        gap: 60px;
      }
    }

    .footer-brand-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .footer-brand-logo {
      height: 32px;
      width: auto;
      object-fit: contain;
    }

    .footer-tagline {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 320px;
    }

    .footer-status-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      width: fit-content;
    }

    .status-indicator {
      width: 6px;
      height: 6px;
      background: var(--light-purple);
      border-radius: 50%;
    }

    /* Grid de Links */
    .footer-nav-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }

    @media (min-width: 600px) {
      .footer-nav-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .footer-nav-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .nav-heading {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a,
    .footer-btn-link {
      font-size: 14px;
      color: var(--text-secondary);
      transition: color var(--transition-fast);
      text-align: left;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .footer-links a:hover,
    .footer-btn-link:hover {
      color: #FFFFFF;
    }

    /* Barra Inferior */
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      padding: 24px 0;
      background: #050508;
    }

    .bottom-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      text-align: center;
    }

    @media (min-width: 768px) {
      .bottom-container {
        flex-direction: row;
        text-align: left;
      }
    }

    .copyright-text {
      font-size: 13px;
      color: var(--text-muted);
    }

    .mono-badge {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--light-purple);
      background: rgba(109, 0, 255, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.2);
      padding: 4px 10px;
      border-radius: 4px;
    }
  `]
})
export class FooterComponent {
  @Output() openDemo = new EventEmitter<{ title: string; desc: string }>();

  currentYear = new Date().getFullYear();

  onOpenRoadmap(): void {
    this.openDemo.emit({
      title: 'Roadmap de Desenvolvimento — Vozly',
      desc: 'Planejamento modular: Fase 1 (Landing & Frontend) concluída; Fase 2 (Core Backend em Spring Boot); Fase 3 (Provedores de Telefonia e Integrações de LLM/STT/TTS).'
    });
  }
}

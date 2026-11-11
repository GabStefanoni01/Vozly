import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogCategory } from '../../../models/blog.models';

@Component({
  selector: 'app-blog-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="blog-footer-root">
      <div class="blog-container footer-layout">
        <!-- Brand & Description -->
        <div class="brand-col">
          <a routerLink="/blog" class="footer-logo-link" aria-label="Vozly Insights Início">
            <img src="brand/vozly-logo-horizontal.png" alt="Vozly" class="h-8 w-auto object-contain" />
          </a>
          <p class="brand-mission">
            Vozly Insights é o veículo editorial oficial da Vozly, dedicado à disseminação de conhecimentos técnicos, pesquisas aplicadas e perspectivas sobre o futuro do atendimento telefônico com inteligência artificial.
          </p>
          <div class="status-pill">
            <span class="status-dot"></span>
            <span>Plataforma Editorial Ativa • 2026</span>
          </div>
        </div>

        <!-- Navigation Columns -->
        <div class="nav-columns">
          <!-- Categories -->
          <div class="nav-group">
            <span class="nav-title">Categorias</span>
            <ul class="nav-links">
              <li>
                <a routerLink="/blog" class="nav-link">Todas as Publicações</a>
              </li>
              <li *ngFor="let cat of categories">
                <a [routerLink]="['/blog', cat.slug]" class="nav-link">{{ cat.name }}</a>
              </li>
            </ul>
          </div>

          <!-- Platform Navigation -->
          <div class="nav-group">
            <span class="nav-title">Plataforma</span>
            <ul class="nav-links">
              <li><a routerLink="/" class="nav-link">Página Inicial</a></li>
              <li><a routerLink="/login" class="nav-link">Entrar no Painel</a></li>
              <li><a routerLink="/register" class="nav-link">Criar Conta Corporativa</a></li>
              <li><a routerLink="/dashboard" class="nav-link">Visão Operacional</a></li>
            </ul>
          </div>

          <!-- Governance -->
          <div class="nav-group">
            <span class="nav-title">Governança & Padrões</span>
            <ul class="nav-links">
              <li><a routerLink="/blog/tecnologia-inovacao/seguranca-informacao-criptografia-ambientes-corporativos" class="nav-link">Conformidade LGPD</a></li>
              <li><a routerLink="/blog/ultimas-noticias/resolucao-anatel-diretrizes-chamadas-automatizadas" class="nav-link">Diretrizes Anatel</a></li>
              <li><a routerLink="/blog/ultimas-noticias/padroes-verificacao-chamadas-stir-shaken" class="nav-link">Padrões STIR/SHAKEN</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bottom-bar">
        <div class="blog-container bottom-container">
          <p class="copyright-notice">
            © {{ currentYear }} Vozly. Todos os direitos reservados. Publicação institucional em conformidade com as diretrizes editoriais e de privacidade.
          </p>
          <div class="tech-spec">
            <span class="spec-tag">Angular Standalone • Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .blog-footer-root {
      background: #050508;
      border-top: 1px solid rgba(139, 61, 255, 0.16);
      padding-top: 64px;
      margin-top: 80px;
    }

    .blog-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .footer-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      padding-bottom: 56px;
    }

    @media (min-width: 1024px) {
      .footer-layout {
        grid-template-columns: 1.2fr 2fr;
        gap: 64px;
      }
    }

    .brand-col {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .footer-logo-link {
      display: inline-block;
    }

    .brand-mission {
      font-size: 14px;
      color: #A1A1AA;
      line-height: 1.65;
      margin: 0;
      max-width: 440px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11.5px;
      color: #C084FC;
      background: rgba(109, 0, 255, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.25);
      padding: 5px 12px;
      border-radius: 9999px;
      width: fit-content;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 6px #22C55E;
    }

    /* Nav Columns */
    .nav-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 32px;
    }

    .nav-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #FFFFFF;
      margin-bottom: 16px;
      display: block;
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .nav-link {
      font-size: 13.5px;
      color: #A1A1AA;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .nav-link:hover {
      color: #C084FC;
    }

    /* Bottom Bar */
    .bottom-bar {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 24px 0;
      background: #030305;
    }

    .bottom-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }

    @media (min-width: 768px) {
      .bottom-container {
        flex-direction: row;
        text-align: left;
      }
    }

    .copyright-notice {
      font-size: 12.5px;
      color: #71717A;
      margin: 0;
    }

    .spec-tag {
      font-family: var(--font-mono, monospace);
      font-size: 11px;
      color: #8B3DFF;
      background: rgba(139, 61, 255, 0.08);
      border: 1px solid rgba(139, 61, 255, 0.2);
      padding: 4px 10px;
      border-radius: 4px;
    }
  `]
})
export class BlogFooterComponent {
  @Input() categories: BlogCategory[] = [];
  public currentYear = new Date().getFullYear();
}

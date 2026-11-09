import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface FeatureBlock {
  num: string;
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  targetAnchor: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section features-staggered-section" id="recursos">
      <!-- Iluminação Radial Difusa Lateral (Inspirada na 5ª Imagem, adaptada ao Roxo Vozly) -->
      <div class="features-radial-ambient" aria-hidden="true"></div>

      <div class="container features-container">
        <!-- Cabeçalho da Seção -->
        <div class="section-header">
          <span class="section-tag">
            <app-icon name="sparkles" [size]="14"></app-icon>
            Capacidades do Produto
          </span>
          <h2 class="section-title">
            Inteligência aplicada ao <span class="gradient-text">atendimento.</span>
          </h2>
          <p class="section-subtitle">
            Uma estrutura pensada para aproximar conversas telefônicas de processos operacionais, com precisão e controle.
          </p>
        </div>

        <!-- Layout Editorial Escalonado em 3 Colunas (Idêntico à 5ª Imagem) -->
        <div class="staggered-columns-grid">
          <!-- Coluna 1 (Itens 01 e 04) -->
          <div class="staggered-col col-1">
            <article class="editorial-feature-item" *ngFor="let item of col1Items">
              <div class="item-index-row">
                <span class="item-num">{{ item.num }}</span>
                <span class="item-hairline" aria-hidden="true"></span>
              </div>

              <div class="item-heading-row">
                <app-icon [name]="item.icon" [size]="19" color="#C084FC"></app-icon>
                <h3 class="item-accent-title">{{ item.title }}</h3>
              </div>

              <p class="item-body-text">{{ item.description }}</p>

              <a [href]="item.targetAnchor" class="item-action-link">
                <span>{{ item.actionLabel }}</span>
                <span class="arrow">→</span>
              </a>
            </article>
          </div>

          <!-- Coluna 2 Escalonada (Itens 02 e 05) -->
          <div class="staggered-col col-2">
            <article class="editorial-feature-item" *ngFor="let item of col2Items">
              <div class="item-index-row">
                <span class="item-num">{{ item.num }}</span>
                <span class="item-hairline" aria-hidden="true"></span>
              </div>

              <div class="item-heading-row">
                <app-icon [name]="item.icon" [size]="19" color="#C084FC"></app-icon>
                <h3 class="item-accent-title">{{ item.title }}</h3>
              </div>

              <p class="item-body-text">{{ item.description }}</p>

              <a [href]="item.targetAnchor" class="item-action-link">
                <span>{{ item.actionLabel }}</span>
                <span class="arrow">→</span>
              </a>
            </article>
          </div>

          <!-- Coluna 3 Escalonada (Itens 03 e 06) -->
          <div class="staggered-col col-3">
            <article class="editorial-feature-item" *ngFor="let item of col3Items">
              <div class="item-index-row">
                <span class="item-num">{{ item.num }}</span>
                <span class="item-hairline" aria-hidden="true"></span>
              </div>

              <div class="item-heading-row">
                <app-icon [name]="item.icon" [size]="19" color="#C084FC"></app-icon>
                <h3 class="item-accent-title">{{ item.title }}</h3>
              </div>

              <p class="item-body-text">{{ item.description }}</p>

              <a [href]="item.targetAnchor" class="item-action-link">
                <span>{{ item.actionLabel }}</span>
                <span class="arrow">→</span>
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features-staggered-section {
      position: relative;
      background-color: var(--bg-primary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 110px 0 130px 0;
      overflow: hidden;
    }

    /* Luz Atmosférica Lateral Suave em Roxo/Violeta */
    .features-radial-ambient {
      position: absolute;
      top: 42%;
      left: 16%;
      transform: translate(-50%, -50%);
      width: 680px;
      height: 680px;
      background: radial-gradient(
        circle,
        rgba(109, 0, 255, 0.16) 0%,
        rgba(139, 61, 255, 0.07) 45%,
        transparent 72%
      );
      filter: blur(60px);
      pointer-events: none;
      z-index: 0;
    }

    .features-container {
      position: relative;
      z-index: 2;
    }

    /* Grade Editorial de 3 Colunas com Escalonamento Vertical (Layout da 5ª Imagem) */
    .staggered-columns-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      margin-top: 24px;
    }

    @media (min-width: 960px) {
      .staggered-columns-grid {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 56px;
        align-items: start;
      }

      .staggered-col.col-1 {
        margin-top: 0;
      }

      .staggered-col.col-2 {
        margin-top: 76px;
      }

      .staggered-col.col-3 {
        margin-top: 152px;
      }
    }

    .staggered-col {
      display: flex;
      flex-direction: column;
      gap: 84px;
    }

    @media (max-width: 959px) {
      .staggered-col {
        gap: 48px;
      }
    }

    /* Bloco Individual Sem Caixa Pesada */
    .editorial-feature-item {
      display: flex;
      flex-direction: column;
      transition: transform var(--transition-base);
    }

    .editorial-feature-item:hover {
      transform: translateY(-3px);
    }

    /* Linha Superior: Número + Filete Horizontal Gradiente */
    .item-index-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }

    .item-num {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      letter-spacing: 0.06em;
    }

    .item-hairline {
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(168, 85, 247, 0.42) 0%,
        rgba(139, 61, 255, 0.14) 65%,
        transparent 100%
      );
      transition: background var(--transition-base);
    }

    .editorial-feature-item:hover .item-hairline {
      background: linear-gradient(
        90deg,
        rgba(192, 132, 252, 0.8) 0%,
        rgba(139, 61, 255, 0.3) 75%,
        transparent 100%
      );
    }

    /* Ícone + Título em Caixa Alta na Cor de Destaque da Marca */
    .item-heading-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .item-accent-title {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #C084FC;
      line-height: 1.3;
      text-shadow: 0 0 24px rgba(168, 85, 247, 0.22);
    }

    /* Texto Descritivo */
    .item-body-text {
      font-size: 14.5px;
      line-height: 1.72;
      color: #A1A1AA;
      margin-bottom: 22px;
      font-weight: 400;
    }

    /* Link de Ação em Caixa Alta com Seta */
    .item-action-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 11.5px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #71717A;
      width: fit-content;
      transition: color var(--transition-fast);
    }

    .item-action-link .arrow {
      display: inline-block;
      transition: transform var(--transition-fast), color var(--transition-fast);
    }

    .editorial-feature-item:hover .item-action-link {
      color: #E9D5FF;
    }

    .editorial-feature-item:hover .item-action-link .arrow {
      transform: translateX(4px);
      color: #C084FC;
    }
  `]
})
export class FeaturesComponent {
  col1Items: FeatureBlock[] = [
    {
      num: '01',
      icon: 'mic',
      title: 'ATENDIMENTO POR VOZ COM IA',
      description: 'Agentes capazes de conversar naturalmente, compreender solicitações e conduzir atendimentos por telefone com clareza.',
      actionLabel: 'OUVIR DEMONSTRAÇÃO DE CHAMADA',
      targetAnchor: '#demonstracao'
    },
    {
      num: '04',
      icon: 'layers',
      title: 'ORGANIZAÇÃO DE ATENDIMENTOS',
      description: 'Transformação das informações coletadas em registros estruturados e padronizados para continuidade operacional imediata.',
      actionLabel: 'EXPLORAR PAINEL OPERACIONAL',
      targetAnchor: '#painel'
    }
  ];

  col2Items: FeatureBlock[] = [
    {
      num: '02',
      icon: 'sparkles',
      title: 'COMPREENSÃO DE SOLICITAÇÕES',
      description: 'Identificação precisa do motivo do contato e organização lógica das informações fornecidas durante a conversa.',
      actionLabel: 'ENTENDER FLUXO DE TRIAGEM',
      targetAnchor: '#como-funciona'
    },
    {
      num: '05',
      icon: 'database',
      title: 'INTEGRAÇÃO COM OPERAÇÕES',
      description: 'Arquitetura planejada para conectar o atendimento telefônico a sistemas de gestão e ferramentas empresariais.',
      actionLabel: 'VER ECOSSISTEMA DE CONEXÕES',
      targetAnchor: '#integracoes'
    }
  ];

  col3Items: FeatureBlock[] = [
    {
      num: '03',
      icon: 'calendar',
      title: 'AGENDAMENTO DE SERVIÇOS',
      description: 'Preparação de fluxos de agendamento e consulta de disponibilidade mediante integração com sistemas compatíveis.',
      actionLabel: 'VER APLICAÇÕES PRÁTICAS',
      targetAnchor: '#aplicacoes'
    },
    {
      num: '06',
      icon: 'message-circle',
      title: 'COMUNICAÇÃO INTEGRADA',
      description: 'Possibilidade de ampliar o fluxo de atendimento com canais complementares, como WhatsApp, conforme as integrações disponíveis.',
      actionLabel: 'CONHECER PROPOSTA COMPLETA',
      targetAnchor: '#contato'
    }
  ];
}

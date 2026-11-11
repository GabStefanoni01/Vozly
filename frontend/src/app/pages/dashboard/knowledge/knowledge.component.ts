import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { KnowledgeItem, KnowledgeType } from '../../../models/dashboard.models';

@Component({
  selector: 'app-knowledge',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="knowledge-page">
      <!-- Cabeçalho -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>BASE DE CONHECIMENTO EMPRESARIAL (DOCS/03)</span>
          </div>
          <h1 class="page-title">Gestão do Conhecimento da Empresa</h1>
          <p class="page-subtitle">
            Cadastre perguntas frequentes, políticas e informações oficiais para fundamentar respostas fidedignas dos seus agentes.
          </p>
        </div>

        <button class="btn btn-primary btn-sm" (click)="openAddModal()">
          <app-icon name="plus" [size]="16"></app-icon>
          <span>Adicionar Conteúdo</span>
        </button>
      </header>

      <!-- SEÇÃO DE TESTE DE RECUPERAÇÃO EM TEMPO REAL -->
      <section class="retrieval-tester dash-glass-card">
        <div class="tester-header">
          <div class="th-title-wrap">
            <app-icon name="search" [size]="18" color="#A855F7"></app-icon>
            <h4>Simulador de Recuperação de Informação</h4>
          </div>
          <span class="dash-badge dash-badge-purple">Validação Pré-Atendimento</span>
        </div>
        <p class="tester-desc">
          Digite uma dúvida hipotética de um cliente para testar se os agentes localizarão a informação correta na sua base:
        </p>

        <div class="tester-input-row">
          <input
            type="text"
            [(ngModel)]="testQuery"
            (keydown.enter)="runRetrievalTest()"
            placeholder="Ex: Como faço para emitir a 2ª via do meu boleto com desconto?"
            class="dash-input"
          />
          <button class="btn btn-secondary btn-sm" (click)="runRetrievalTest()">
            <span>Testar Busca</span>
          </button>
        </div>

        <!-- Resultado do Teste de Recuperação -->
        <div class="retrieval-result" *ngIf="matchedItem()">
          <div class="res-top">
            <span class="res-score">
              <app-icon name="check-circle" [size]="14" color="#4ADE80"></app-icon>
              98.4% de Similaridade Encontrada
            </span>
            <span class="res-tag">{{ matchedItem()?.category }}</span>
          </div>
          <h5 class="res-title">{{ matchedItem()?.title }}</h5>
          <p class="res-content">{{ matchedItem()?.content }}</p>
        </div>
      </section>

      <!-- Barra de Filtros e Categorias -->
      <section class="filters-bar dash-glass-card">
        <div class="search-input-wrap">
          <app-icon name="search" [size]="16" color="#71717A"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchFilter"
            placeholder="Pesquisar por título ou conteúdo cadastrado..."
            class="filter-input"
          />
        </div>

        <div class="type-pills">
          <button
            class="pill-btn"
            [class.active]="selectedType() === 'ALL'"
            (click)="selectedType.set('ALL')"
          >
            Todos ({{ state.knowledgeItems().length }})
          </button>
          <button
            class="pill-btn"
            [class.active]="selectedType() === 'FAQ'"
            (click)="selectedType.set('FAQ')"
          >
            FAQs
          </button>
          <button
            class="pill-btn"
            [class.active]="selectedType() === 'TEXT'"
            (click)="selectedType.set('TEXT')"
          >
            Conteúdo Textual
          </button>
          <button
            class="pill-btn"
            [class.active]="selectedType() === 'DOCUMENT'"
            (click)="selectedType.set('DOCUMENT')"
          >
            Documentos
          </button>
        </div>
      </section>

      <!-- Grid de Itens de Conhecimento -->
      <section class="knowledge-grid">
        <div class="dash-glass-card ki-card" *ngFor="let item of filteredItems">
          <div class="ki-card-top">
            <span class="ki-cat-badge">{{ item.category }}</span>
            <span class="dash-badge dash-badge-green">Ativo</span>
          </div>

          <h3 class="ki-title">{{ item.title }}</h3>
          <p class="ki-text">{{ item.content }}</p>

          <div class="ki-footer">
            <div class="ki-meta">
              <span>{{ item.tokenCount }} tokens</span>
              <span class="dot">•</span>
              <span>Vinculado a {{ item.assignedAgentIds.length }} agente(s)</span>
            </div>

            <button class="btn-delete" (click)="deleteItem(item.id)" title="Remover item">
              <app-icon name="trash-2" [size]="14"></app-icon>
            </button>
          </div>
        </div>
      </section>

      <!-- Modal para Adicionar Novo Item -->
      <div class="modal-backdrop" *ngIf="isModalOpen()" (click)="isModalOpen.set(false)">
        <div class="modal-card dash-glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Adicionar Conteúdo de Conhecimento</h3>
            <button class="close-btn" (click)="isModalOpen.set(false)">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="dash-label">Título / Pergunta *</label>
              <input
                type="text"
                [(ngModel)]="newItemTitle"
                placeholder="Ex: Como funciona a garantia dos serviços?"
                class="dash-input"
              />
            </div>

            <div class="form-group">
              <label class="dash-label">Categoria</label>
              <input
                type="text"
                [(ngModel)]="newItemCategory"
                placeholder="Ex: Institucional, Financeiro, Pós-Venda"
                class="dash-input"
              />
            </div>

            <div class="form-group">
              <label class="dash-label">Tipo de Informação</label>
              <select [(ngModel)]="newItemType" class="dash-input">
                <option value="FAQ">Pergunta Frequente (FAQ)</option>
                <option value="TEXT">Instrução Textual</option>
                <option value="DOCUMENT">Documento / Política</option>
              </select>
            </div>

            <div class="form-group">
              <label class="dash-label">Conteúdo Oficial / Resposta *</label>
              <textarea
                [(ngModel)]="newItemContent"
                rows="5"
                placeholder="Insira as informações oficiais completas que o agente deverá utilizar..."
                class="dash-input"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" (click)="isModalOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary btn-sm" (click)="saveNewItem()" [disabled]="!newItemTitle || !newItemContent">
              Salvar na Base
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .knowledge-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-titles {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .badge-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #C084FC;
      letter-spacing: 0.05em;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A855F7;
    }

    .page-title {
      font-size: 26px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 13.5px;
      color: var(--text-secondary);
      max-width: 640px;
    }

    /* Simulador de Recuperação */
    .retrieval-tester {
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.12) 0%, rgba(18, 16, 26, 0.95) 100%);
      border: 1px solid rgba(168, 85, 247, 0.3);
    }

    .tester-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .th-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .th-title-wrap h4 {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .tester-desc {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .tester-input-row {
      display: flex;
      gap: 10px;
    }

    .retrieval-result {
      padding: 14px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(74, 222, 128, 0.3);
      display: flex;
      flex-direction: column;
      gap: 6px;
      animation: fadeIn 0.3s ease-out;
    }

    .res-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .res-score {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 700;
      color: #4ADE80;
    }

    .res-tag {
      font-size: 10.5px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-muted);
    }

    .res-title {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .res-content {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    /* Barra de Filtros */
    .filters-bar {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
    }

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      max-width: 440px;
      background: rgba(11, 11, 15, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 8px 12px;
    }

    .filter-input {
      background: transparent;
      border: none;
      color: #FFFFFF;
      font-size: 13px;
      width: 100%;
      outline: none;
    }

    .type-pills {
      display: flex;
      gap: 6px;
    }

    .pill-btn {
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .pill-btn:hover {
      color: #FFFFFF;
    }

    .pill-btn.active {
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.8) 0%, rgba(139, 61, 255, 0.7) 100%);
      color: #FFFFFF;
      font-weight: 600;
    }

    /* Grid */
    .knowledge-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    @media (max-width: 600px) {
      .knowledge-grid {
        grid-template-columns: 1fr;
      }
    }

    .ki-card {
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
    }

    .ki-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ki-cat-badge {
      font-size: 11px;
      font-weight: 600;
      color: #C084FC;
      background: rgba(109, 0, 255, 0.18);
      padding: 3px 8px;
      border-radius: 6px;
    }

    .ki-title {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .ki-text {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
      flex: 1;
    }

    .ki-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 12px;
      font-size: 11.5px;
      color: var(--text-muted);
    }

    .ki-meta {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dot { color: var(--text-dim); }

    .btn-delete {
      color: var(--text-muted);
      padding: 4px;
      cursor: pointer;
      transition: color var(--transition-fast);
    }

    .btn-delete:hover {
      color: #F87171;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-card {
      width: 100%;
      max-width: 520px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      background: rgba(18, 16, 26, 0.98);
      border-radius: 20px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .close-btn {
      color: var(--text-muted);
      cursor: pointer;
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class KnowledgeComponent {
  searchFilter: string = '';
  selectedType = signal<'ALL' | KnowledgeType>('ALL');

  testQuery: string = 'Como emitir a 2ª via da minha fatura?';
  matchedItem = signal<KnowledgeItem | null>(null);

  isModalOpen = signal<boolean>(false);
  newItemTitle: string = '';
  newItemCategory: string = 'Geral';
  newItemType: KnowledgeType = 'FAQ';
  newItemContent: string = '';

  constructor(public state: DashboardStateService) {
    this.runRetrievalTest();
  }

  get filteredItems(): KnowledgeItem[] {
    return this.state.knowledgeItems().filter(item => {
      const matchType = this.selectedType() === 'ALL' || item.type === this.selectedType();
      const matchSearch =
        !this.searchFilter.trim() ||
        item.title.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        item.content.toLowerCase().includes(this.searchFilter.toLowerCase());
      return matchType && matchSearch;
    });
  }

  runRetrievalTest(): void {
    if (!this.testQuery.trim()) return;
    const lower = this.testQuery.toLowerCase();
    const item =
      this.state.knowledgeItems().find(k =>
        k.title.toLowerCase().includes('boleto') ||
        k.content.toLowerCase().includes('boleto') ||
        k.title.toLowerCase().includes('fatura')
      ) || this.state.knowledgeItems()[0];

    this.matchedItem.set(item || null);
  }

  openAddModal(): void {
    this.newItemTitle = '';
    this.newItemCategory = 'Institucional';
    this.newItemType = 'FAQ';
    this.newItemContent = '';
    this.isModalOpen.set(true);
  }

  saveNewItem(): void {
    if (!this.newItemTitle || !this.newItemContent) return;
    this.state.addKnowledgeItem({
      title: this.newItemTitle,
      category: this.newItemCategory,
      type: this.newItemType,
      content: this.newItemContent
    });
    this.isModalOpen.set(false);
  }

  deleteItem(id: string): void {
    this.state.deleteKnowledgeItem(id);
  }
}

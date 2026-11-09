import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Layout
import { HeaderComponent } from '../../components/layout/header/header.component';
import { FooterComponent } from '../../components/layout/footer/footer.component';

// Seções da Landing Page
import { HeroComponent } from '../../components/sections/hero/hero.component';
import { BrandStripComponent } from '../../components/sections/brand-strip/brand-strip.component';
import { ProblemComponent } from '../../components/sections/problem/problem.component';
import { HowItWorksComponent } from '../../components/sections/how-it-works/how-it-works.component';
import { CallDemoComponent } from '../../components/sections/call-demo/call-demo.component';
import { FeaturesComponent } from '../../components/sections/features/features.component';
import { IndustriesComponent } from '../../components/sections/industries/industries.component';
import { DashboardPreviewComponent } from '../../components/sections/dashboard-preview/dashboard-preview.component';
import { IntegrationsComponent } from '../../components/sections/integrations/integrations.component';
import { SecurityComponent } from '../../components/sections/security/security.component';
import { FinalCtaComponent } from '../../components/sections/final-cta/final-cta.component';

// UI
import { DemoModalComponent } from '../../components/ui/demo-modal/demo-modal.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    BrandStripComponent,
    ProblemComponent,
    HowItWorksComponent,
    CallDemoComponent,
    FeaturesComponent,
    IndustriesComponent,
    DashboardPreviewComponent,
    IntegrationsComponent,
    SecurityComponent,
    FinalCtaComponent,
    FooterComponent,
    DemoModalComponent
  ],
  template: `
    <!-- Cabeçalho Fixo -->
    <app-header (openDemo)="handleOpenDemo($event)"></app-header>

    <!-- Conteúdo da Landing Page -->
    <main id="main-content" class="main-wrapper">
      <app-hero (openDemo)="handleOpenDemo($event)"></app-hero>
      <app-brand-strip></app-brand-strip>
      <app-problem></app-problem>
      <app-how-it-works></app-how-it-works>
      <app-call-demo (openDemo)="handleOpenDemo($event)"></app-call-demo>
      <app-features></app-features>
      <app-industries></app-industries>
      <app-dashboard-preview (openDemo)="handleOpenDemo($event)"></app-dashboard-preview>
      <app-integrations></app-integrations>
      <app-security></app-security>
      <app-final-cta (openDemo)="handleOpenDemo($event)"></app-final-cta>
    </main>

    <!-- Rodapé -->
    <app-footer (openDemo)="handleOpenDemo($event)"></app-footer>

    <!-- Modal Demonstrativo -->
    <app-demo-modal
      [isOpen]="isModalOpen()"
      [title]="modalTitle()"
      [description]="modalDesc()"
      (closeEvent)="handleCloseModal()"
    ></app-demo-modal>
  `,
  styles: [`
    .main-wrapper {
      position: relative;
      overflow-x: hidden;
      width: 100%;
    }
  `]
})
export class LandingPageComponent {
  isModalOpen = signal(false);
  modalTitle = signal('Conhecer a Vozly');
  modalDesc = signal('Demonstração institucional do produto e registro de interesse antecipado.');

  handleOpenDemo(event: { title: string; desc: string }): void {
    this.modalTitle.set(event.title);
    this.modalDesc.set(event.desc);
    this.isModalOpen.set(true);
  }

  handleCloseModal(): void {
    this.isModalOpen.set(false);
  }
}

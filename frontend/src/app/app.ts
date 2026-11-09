import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Layout
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';

// Seções da Landing Page
import { HeroComponent } from './components/sections/hero/hero.component';
import { BrandStripComponent } from './components/sections/brand-strip/brand-strip.component';
import { ProblemComponent } from './components/sections/problem/problem.component';
import { HowItWorksComponent } from './components/sections/how-it-works/how-it-works.component';
import { CallDemoComponent } from './components/sections/call-demo/call-demo.component';
import { FeaturesComponent } from './components/sections/features/features.component';
import { IndustriesComponent } from './components/sections/industries/industries.component';
import { DashboardPreviewComponent } from './components/sections/dashboard-preview/dashboard-preview.component';
import { IntegrationsComponent } from './components/sections/integrations/integrations.component';
import { SecurityComponent } from './components/sections/security/security.component';
import { FinalCtaComponent } from './components/sections/final-cta/final-cta.component';

// UI
import { DemoModalComponent } from './components/ui/demo-modal/demo-modal.component';

@Component({
  selector: 'app-root',
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
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Modal demonstrativo interativo global
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

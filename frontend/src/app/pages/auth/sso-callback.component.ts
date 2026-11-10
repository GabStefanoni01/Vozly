import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiAuthService } from '../../services/api-auth.service';

@Component({
  standalone: true,
  selector: 'app-sso-callback',
  imports: [CommonModule],
  template: `<main class="sso-state"><p>{{ message }}</p></main>`,
  styles: [`.sso-state{min-height:100vh;display:grid;place-items:center;background:#050505;color:#fff;font:500 15px Inter,sans-serif}`]
})
export class SsoCallbackComponent implements OnInit {
  message = 'Concluindo seu acesso com a Microsoft...';

  constructor(private readonly auth: ApiAuthService, private readonly router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.auth.completeMicrosoftLogin();
      await this.auth.me();
      await this.router.navigateByUrl('/');
    } catch {
      this.auth.clearLocalSession();
      await this.router.navigate(['/login'], { queryParams: { error: 'microsoft_sso_failed' } });
    }
  }
}

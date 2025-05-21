import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="analytics">
      <h1>Analytics</h1>
      <p>Contenuto della pagina analytics in fase di sviluppo.</p>
    </div>
  `,
    styles: [`
    .analytics {
      padding: 20px;
      h1 {
        color: #2c3e50;
        margin-bottom: 20px;
      }
    }
  `]
})
export class AnalyticsComponent { }
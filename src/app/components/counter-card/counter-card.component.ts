import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-counter-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="counter-card">
      <div class="icon">
        <i class="fas fa-{{icon}}"></i>
      </div>
      <div class="content">
        <h3>{{ title }}</h3>
        <p class="value">{{ prefix }} {{ value }}</p>
      </div>
    </div>
  `,
    styleUrls: ["./counter-card.component.scss"]
})
export class CounterCardComponent {
    @Input() title: string = '';
    @Input() value: string = '';
    @Input() icon: string = 'chart-bar';
    @Input() prefix: string = '';
}
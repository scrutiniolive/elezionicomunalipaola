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
    styles: [`
    .counter-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      display: flex;
      align-items: center;
      
    
      
      .icon {
        background-color: #3498db;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-right: 11px;
      }
      
      .content {
        h3 {
          margin: 0;
          color: #7f8c8d;
          font-size: 16px;
          font-weight: 500;
        }
        
        .value {
          font-size: 24px;
          font-weight: 700;
          margin: 5px 0 0;
          color: #2c3e50;
        }
      }
    }
  `]
})
export class CounterCardComponent {
    @Input() title: string = '';
    @Input() value: string = '';
    @Input() icon: string = 'chart-bar';
    @Input() prefix: string = '';
}
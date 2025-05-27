// maintenance-banner.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-maintenance-banner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="maintenance-banner" *ngIf="isVisible">
      <span>
        🚨 🆕 Dalla sezione "Scarica Risultati" è possibile scaricare un Excel con i risultati dettagliati per seggio. 🆕 🚨
      </span>
      <button (click)="closeBanner()" class="close-button">×</button>
    </div>
  `,
    styleUrls: ["./banner.component.scss"]
})
export class MaintenanceBannerComponent implements OnInit, OnDestroy {
    isVisible = true;
    private timer: any;
    daysLeft = 0;
    hoursLeft = 0;
    minutesLeft = 0;
    secondsLeft = 0;

    ngOnInit() {
        const endDate = new Date('2025-05-26T15:00:00');

        this.timer = setInterval(() => {
            const now = new Date();
            const diff = endDate.getTime() - now.getTime();

            this.daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
            this.hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            this.secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

            if (diff <= 0) {
                //this.isVisible = false;
                clearInterval(this.timer);
            }
        }, 1000);
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    closeBanner() {
        this.isVisible = false;
    }
}
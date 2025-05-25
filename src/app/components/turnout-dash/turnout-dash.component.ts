import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterCardComponent } from '../counter-card/counter-card.component';
import { interval, Subscription } from 'rxjs';
import { DashboardControllerService, TurnoutControllerService } from '../../api';
import { TurnoutComponent } from '../turnout/turnout.component';

@Component({
    selector: 'app-turn-dash',
    standalone: true,
    imports: [
        CommonModule,
        CounterCardComponent,
        TurnoutComponent
    ],
    template: `
    <div class="dashboard">


   <div class="card-container">
  

    <app-counter-card
      [title]="'Voti'"
      [value]="votingElectors"
      [icon]="'pencil'"
      [prefix]="''"
    ></app-counter-card>

    <app-counter-card
      [title]="'Ultimo aggiornamento dati'"
      [value]="dateElectors"
      [icon]="'clock'"
      [prefix]="''"
    ></app-counter-card>
    
    
  
  
  </div>

  <div class="chart-row">
          <div class="chart-col">
        <app-turnout
          dataSource="turnout"
          title="Affluenza Seggi">
        </app-turnout>
      </div></div>

  <div class="chart-container">
    <div class="chart-row">
      <div class="chart-col">
        <app-turnout
           dataSource="turnout-votes"
           title="Votanti Seggi">
         </app-turnout>
        </div></div>
  </div>
</div>
  `,
    styleUrls: ['./turnout-dash.component.scss']
})
export class TurnoutDashbComponent implements OnInit, OnDestroy {
    totalElectors: string = '-';
    votingElectors: string = '-';
    dateElectors: string = '-';


    private updateSubscription: Subscription | undefined;

    constructor(
        private turnoutControllerService: TurnoutControllerService
    ) { }

    ngOnInit(): void {
        this.loadAllData();
        this.setupAutoRefresh();
    }

    private loadAllData(): void {
        this.turnoutControllerService.getTurnout()
            .subscribe({
                next: (data) => {
                    this.totalElectors = data.totalElectors ? data.totalElectors.toString() : "-",
                        this.votingElectors = data.votingElectors ? data.votingElectors.toString() : '-',
                        this.dateElectors = data.dateElectors ?? '-'
                },
                error: (err) => console.error('Errore nel caricamento dei dati:', err)
            });
    }

    private setupAutoRefresh(): void {
        this.updateSubscription = interval(121 * 1000).subscribe(() => {
            this.loadAllData();
        });
    }

    ngOnDestroy() {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }
}
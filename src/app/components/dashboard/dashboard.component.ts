import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterCardComponent } from '../counter-card/counter-card.component';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { DataService } from '../../services/data.service';

import { CardControllerService } from '../../api/api/cardController.service';
import { forkJoin, interval, map, Subscription } from 'rxjs';
import { DashboardControllerService, ElectionDisplayControllerService, VoteControllerService, VoteResponse } from '../../api';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        CounterCardComponent,
        PieChartComponent, BarChartComponent
    ],
    template: `
    <div class="dashboard">
  <div class="card-container">
    <app-counter-card
      [title]="'Stato Scrutinio'"
      [value]="liveState"
      [icon]="'tower-broadcast'"
      [prefix]="''"
    ></app-counter-card>

      <app-counter-card
      [title]="'Seggi Attivi'"
      [value]="numSection"
      [icon]="'person-booth'"
      [prefix]="''"
    ></app-counter-card>
    
    <app-counter-card
      [title]="'Votanti'"
      [value]="votes"
      [icon]="'pencil'"
      [prefix]="''"
    ></app-counter-card>
    
    <app-counter-card
      [title]="'Partito in Vantaggio'"
      [value]="party"
      [icon]="'landmark'"
      [prefix]="''"
    ></app-counter-card>
    
  
  </div>
  
  <div class="chart-container">
    <div class="chart-row">
      <div class="chart-col">
         <app-pie-chart
           dataSource="mayors"
           title="Distribuzione Voti Sindaco">
         </app-pie-chart>
        </div></div>

  <div class="chart-row">
      <div class="chart-col">
                    <app-bar-chart dataSource="councillors" > </app-bar-chart>

      </div>
    </div>

       <div class="chart-row">
          <div class="chart-col">
        <app-pie-chart
          dataSource="votes"
          title="Distribuzione Schede Elettorali">
        </app-pie-chart>
      </div></div>
  
  
  </div>
</div>
  `,
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    liveState: string = '-';
    numSection: string = '-';
    party: string = '-';
    votes: string = '-';

    private updateSubscription: Subscription | undefined;

    constructor(
        private dashboardControllerService: DashboardControllerService
    ) { }

    ngOnInit(): void {
        this.loadAllData();
        this.setupAutoRefresh();
    }

    private loadAllData(): void {
        this.dashboardControllerService.globalStats()
            .subscribe({
                next: (data) => {
                    this.liveState = data.countingInProgress ? 'In Diretta' : "Terminato",
                        this.numSection = data.sectionClosed ? (17 - data.sectionClosed).toString() + ' di 17' : '17 di 17',
                        this.party = data.leadPartyList ? data.leadPartyList : '-',
                        this.votes = data.totalVotes ? data.totalVotes.toString() : '-'
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
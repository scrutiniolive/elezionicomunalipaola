import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterCardComponent } from '../counter-card/counter-card.component';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { interval, Subscription } from 'rxjs';
import { DashboardControllerService, ElectionDisplayControllerService, SectionDto, VoteControllerService, VoteResponse } from '../../api';
import { FormsModule } from '@angular/forms';


interface SectionData {
    id: number;
    name: string;
    votes?: string;
    state?: string;
}
@Component({
    selector: 'app-seat-results',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CounterCardComponent, PieChartComponent, BarChartComponent
    ],
    template: `
    <div class="dashboard">
    
      
      <div class="card-container">
        <div class="selector-card">
          <div class="icon">
             <i class="fa-solid fa-person-booth"></i>
          </div>
          <div class="content">
            <h3>Seleziona Sezione</h3>
            <select [(ngModel)]="selectedSection" (change)="onSectionChange()">
              <option value="">Tutte le sezioni</option>
              <option *ngFor="let section of sections" [value]="section.id">
                {{section.name}}
              </option>
            </select>
          </div>
        </div>

        <app-counter-card
          [title]="'Stato Seggio'"
          [value]="selectedSectionData?.state || liveState"
          [icon]="'tower-broadcast'"
          [prefix]="''"
        ></app-counter-card>
        
        <app-counter-card
          [title]="'Votanti'"
          [value]="selectedSectionData?.votes || votes"
          [icon]="'pencil'"
          [prefix]="''"
        ></app-counter-card>
      </div>


       <div class="chart-container">
        <div class="chart-row">
          <div class="chart-col">
             <app-pie-chart
        dataSource="seat-mayors"
         [sectionId]="selectedSectionData?.id"
        title="Distribuzione Voti Sindaco">
    </app-pie-chart>
          </div>
          
          
        </div>


        <div class="chart-row">
          <div class="chart-col">
             <app-bar-chart dataSource="seat-councillors"   [sectionId]="selectedSectionData?.id"> </app-bar-chart>
          </div>
        </div>

 <div class="chart-row">
        <div class="chart-col">
            <app-pie-chart
        dataSource="seat-votes"
        [sectionId]="selectedSectionData?.id"
        title="Distribuzione Schede Elettorali">   
    </app-pie-chart>
          </div>
 </div>

         
    </div>
      
    </div>

   
  `,
    styleUrls: ['./seat-results.component.scss']
})
export class SeatResultsComponent implements OnInit, OnDestroy {
    liveState: string = '-';
    numSection: string = '-';
    party: string = '-';
    votes: string = '-';
    sections: SectionData[] = [];
    selectedSection: number = -1;
    selectedSectionData: SectionData | null = null;
    private updateSubscription: Subscription | undefined;

    constructor(
        private dashboardControllerService: DashboardControllerService,
        private electionDisplayControllerService: ElectionDisplayControllerService
    ) { }

    ngOnInit(): void {
        this.loadSections();
        this.setupAutoRefresh();
    }

    private loadSections(): void {
        this.electionDisplayControllerService.allSectionInfo().subscribe({
            next: (data: SectionDto[]) => {
                this.sections = this.mapSectionDtoToSectionData(data);
                if (this.sections.length > 0) {
                    this.sections.sort((a, b) => {
                        const nameA = a.name ?? '-';
                        const nameB = b.name ?? '-';

                        return nameA.localeCompare(nameB);
                    });
                    this.selectedSection = this.sections[0].id;
                    this.onSectionChange(); // Attiva il cambio sezione
                }
            },
            error: (err) => console.error('Errore nel caricamento delle sezioni:', err)
        });
    }

    private mapSectionDtoToSectionData(dto: SectionDto[]): SectionData[] {
        return dto.map(section => ({
            id: section.id || 0,
            name: section.name || '',
            state: section.ballotOpen ? 'Aperto' : 'Chiuso',
            votes: '-'
        }));
    }
    onSectionChange(): void {
        if (this.selectedSection) {
            this.dashboardControllerService.globalSectionStats(this.selectedSection).subscribe({
                next: (data) => {
                    this.selectedSectionData = {
                        id: data.sectionId,
                        name: data.sectionName || '',
                        state: data.sectionClosed ? 'Aperto' : 'Chiuso',
                        votes: ((data.totalVotes ?? 0) - (data.blanks ?? 0) - (data.nulls ?? 0)).toString()
                    } as SectionData;
                },
                error: (err) => console.error('Errore nel caricamento dei dettagli sezione:', err)
            });
        } else {
            this.selectedSectionData = null;
        }
    }

    private loadAllData(): void {
        this.dashboardControllerService.globalStats()
            .subscribe({
                next: (data) => {
                    this.liveState = data.countingInProgress ? 'In Diretta' : "Terminato",
                        this.numSection = data.sectionClosed ? (17 - data.sectionClosed).toString() + ' di 17' : '-',
                        this.party = data.leadPartyList ? data.leadPartyList : '-',
                        this.votes = "-"
                },
                error: (err) => console.error('Errore nel caricamento dei dati:', err)
            });
    }

    private setupAutoRefresh(): void {
        this.updateSubscription = interval(300000).subscribe(() => {
            this.loadAllData();
        });
    }

    ngOnDestroy() {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }
}
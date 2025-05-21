import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { CandidateDto, DashboardControllerService } from '../../../api';
import { interval, map, Subscription } from 'rxjs';


Chart.register(...registerables);

@Component({
    selector: 'app-bar-chart',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    template: `
    <div class="chart-container">
      <h3>Voti Candidati a Consigliere</h3>
      <ng-container *ngIf="hasData; else noData">
        <canvas baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="'bar'">
        </canvas>
      </ng-container>
      <ng-template #noData>
        <div class="no-data-message">
          <p>Nessun dato disponibile</p>
        </div>
      </ng-template>
    </div>
  `,
    styles: [`
    .chart-container {
      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #2c3e50;
      }
      height: 400px;
      min-height: 300px;
    }

    .no-data-message {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background-color: #f8f9fa;
      border-radius: 8px;
      
      p {
        color: #6c757d;
        font-size: 1.1em;
      }
    }
  `]
})
export class BarChartComponent implements OnInit, OnDestroy, OnChanges {

    private updateSubscription: Subscription | undefined;
    public hasData: boolean = false;
    @Input() dataSource: string = 'default';
    @Input() sectionId?: number;

    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: [],
        datasets: []
    };

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false  // Riduce il disordine visivo
                },
                ticks: {
                    precision: 0  // Arrotonda i valori dell'asse X a numeri interi
                }
            },
            y: {
                grid: {
                    display: false  // Rimuove le linee della griglia orizzontale
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,  // Dimensione più compatta per la legenda
                    usePointStyle: true  // Usa stili punto anziché rettangoli
                }
            },
            tooltip: {
                callbacks: {
                    // Personalizza i tooltip per mostrare format specifici
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.x}`;
                    }
                }
            }
        },
        // Controlla le dimensioni del grafico
        maintainAspectRatio: false
    };

    constructor(private dashboardControllerService: DashboardControllerService) { }


    ngOnDestroy() {
        // Importante: annulla la sottoscrizione quando il componente viene distrutto
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.loadChartData();
        this.updateSubscription = interval(300000).subscribe(() => {
            this.loadChartData();
        });
    }

    private loadChartData(): void {
        switch (this.dataSource) {
            case 'dashboard':
                this.dashboardControllerService.councillorsTotalVotes().subscribe(candidates => {
                    this.updateChartData(candidates);
                });
                break;

            case 'seat-councillors':
                if (!this.sectionId || this.sectionId < 0) break;
                this.dashboardControllerService.globalSectionStats(this.sectionId).pipe(
                    map(data => data.councilors || [])
                ).subscribe(candidates => {
                    this.updateChartData(candidates);
                });
                break;

            default:
                console.warn('DataSource non riconosciuto:', this.dataSource);
                break;
        }
    }

    // Aggiorna il componente quando cambia sectionId
    ngOnChanges(changes: SimpleChanges) {
        this.loadChartData();
    }

    private updateChartData(data: CandidateDto[] | any[]): void {
        const validData = data
            .filter(item => item.votes != null && (item.partyListId != null || item.id != null));

        this.hasData = validData.length > 0 &&
            validData.some(item => (item.votes ?? 0) > 0);

        if (this.hasData) {
            this.barChartData = this.transformData(validData);
        }
    }

    private transformData(validData: any[]): ChartData<'bar'> {
        const labels = validData.map(item => item.name ?? '');
        const datasets = [{
            data: validData.map(item => item.votes ?? 0),
            label: this.getDatasetLabel(),
            backgroundColor: validData.map(() => "#3498db"),
            borderColor: validData.map(() => "#3498db"),
            borderWidth: 1
        }];

        return {
            labels,
            datasets
        };
    }

    private getDatasetLabel(): string {
        switch (this.dataSource) {
            case 'councillors':
            case 'seat-councillors':
                return 'Voti Consiglieri';
            case 'party-list':
            case 'seat-party-list':
                return 'Voti Liste';
            default:
                return 'Voti';
        }
    }
}








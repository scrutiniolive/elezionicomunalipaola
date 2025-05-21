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
        <div class="chart-wrapper">
          <canvas baseChart
            [data]="barChartData"
            [options]="barChartOptions"
            [type]="'bar'">
          </canvas>
        </div>
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
      width: 100%;
      overflow-x: hidden;
      
      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #2c3e50;
        font-size: 1.2rem;
        text-align: center;
        padding: 0 10px;
        overflow-wrap: break-word;
      }
    }

    .chart-wrapper {
      position: relative;
      height: 400px;
      max-height: 70vh;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 5px;
      
      canvas {
        min-height: 400px;
      }
    }

    .no-data-message {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      width: 100%;
      background-color: #f8f9fa;
      border-radius: 8px;
      
      p {
        color: #6c757d;
        font-size: 1.1em;
      }
    }

    @media (max-width: 768px) {
      .chart-wrapper {
        height: 350px;
        padding-right: 2px;
      }
      
      .chart-container h3 {
        font-size: 1rem;
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
                    drawOnChartArea: false
                },
                ticks: {
                    precision: 0,
                    maxRotation: 0,
                    autoSkip: true,
                    font: {
                        size: 10
                    }
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    font: {
                        size: 10
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                    font: {
                        size: 11
                    }
                },
                display: true
            },
            tooltip: {
                enabled: true,
                mode: 'nearest',
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.x}`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 5,
                right: 20,
                top: 0,
                bottom: 0
            }
        }
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
        // Ordina per voti in ordine decrescente
        const sortedData = [...validData].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));

        // Limita a 20 elementi se ce ne sono troppi, e raggruppa gli altri come "Altri"
        let processedData = sortedData;
        if (sortedData.length > 20) {
            const top20 = sortedData.slice(0, 20);
            const othersVotes = sortedData.slice(20).reduce((sum, item) => sum + (item.votes ?? 0), 0);

            if (othersVotes > 0) {
                processedData = [...top20, {
                    name: "Altri",
                    votes: othersVotes
                }];
            } else {
                processedData = top20;
            }
        }

        const labels = processedData.map(item => item.name ?? '');
        const datasets = [{
            data: processedData.map(item => item.votes ?? 0),
            label: this.getDatasetLabel(),
            backgroundColor: processedData.map(() => "#3498db"),
            borderColor: processedData.map(() => "#3498db"),
            borderWidth: 1
        }];

        // Calcola altezza necessaria in base al numero di elementi
        const minHeight = Math.max(400, processedData.length * 25);
        setTimeout(() => {
            const chartContainer = document.querySelector('.chart-wrapper canvas');
            if (chartContainer) {
                (chartContainer as HTMLElement).style.minHeight = `${minHeight}px`;
            }
        }, 0);

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








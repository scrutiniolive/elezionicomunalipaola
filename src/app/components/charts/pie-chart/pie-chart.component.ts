import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DataService } from '../../../services/data.service';
import { CandidateDto, DashboardControllerService, VoteResponse } from '../../../api';
import { interval, map, Subscription } from 'rxjs';


Chart.register(...registerables);
@Component({
    selector: 'app-pie-chart',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    template: `
      <div class="chart-container">
        <h3>{{ title }}</h3>
        <ng-container *ngIf="hasData; else noData">
          <div class="chart-wrapper">
            <canvas baseChart
              [data]="pieChartData"
              [options]="pieChartOptions"
              [type]="'pie'">
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
        max-width: 100%;
        
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
        height: 280px;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .no-data-message {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
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
          height: 220px;
        }
        
        .chart-container h3 {
          font-size: 1rem;
        }
      }
    `]
})
export class PieChartComponent implements OnInit, OnDestroy, OnChanges {


    @Input() dataSource: string = 'default';  // 'default', 'alternative', ecc.
    @Input() title: string = 'Distribuzione Dati';
    @Input() customData?: any; // Opzionale: passa direttamente i dati
    @Input() sectionId?: number;

    constructor(private dataService: DataService, private dashboardControllerService: DashboardControllerService) { }

    public hasData: boolean = false;

    private updateSubscription: Subscription | undefined;

    ngOnInit(): void {
        if (this.customData) {
            this.pieChartData = this.customData;
        } else {
            this.loadChartData();
            this.updateSubscription = interval(300000).subscribe(() => {
                this.loadChartData();
            });
        }

        // Aggiunta della gestione delle dimensioni della finestra
        this.adjustChartLayoutForScreenSize();
        window.addEventListener('resize', this.adjustChartLayoutForScreenSize.bind(this));
    }

    ngOnDestroy() {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
        window.removeEventListener('resize', this.adjustChartLayoutForScreenSize.bind(this));
    }

    private adjustChartLayoutForScreenSize() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;

        // Aggiorna le opzioni del chart in base alla dimensione dello schermo
        if (this.pieChartOptions && this.pieChartOptions.plugins && this.pieChartOptions.plugins.legend) {
            if (isMobile) {
                this.pieChartOptions.plugins.legend.position = 'bottom';
            } else if (isTablet) {
                this.pieChartOptions.plugins.legend.position = 'right';
            } else {
                this.pieChartOptions.plugins.legend.position = 'right';
            }
        }
    }


    ngOnChanges(changes: SimpleChanges): void {
        this.loadChartData();
    }



    public pieChartData: ChartConfiguration<'pie'>['data'] = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
        }]
    };

    public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    boxWidth: 10,
                    padding: 10,
                    font: {
                        size: 11
                    }
                },
                display: true
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (context) {
                        const dataset = context.dataset;
                        const total = dataset.data.reduce((acc, data) => acc + data, 0);
                        const value = dataset.data[context.dataIndex];
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${value} (${percentage}%)`;
                    }
                }
            }
        }
    };



    private loadChartData(): void {
        switch (this.dataSource) {
            case 'votes':
                this.dashboardControllerService.globalStats().subscribe(
                    (voteResponse: VoteResponse) => {

                        let blankVotes = voteResponse.blanks ?? 0;
                        let nullVotes = voteResponse.nulls ?? 0;
                        let totalVotes = voteResponse.totalVotes ?? 0;
                        let validVotes = totalVotes - nullVotes - blankVotes;

                        this.pieChartData = {
                            labels: ["Schede Valide", "Schede Bianche", "Schede Nulle"],
                            datasets: [{
                                data: [validVotes, blankVotes, nullVotes],
                                backgroundColor: this.generateColors(3)
                            }]
                        };

                        this.hasData = this.pieChartData.datasets.length > 0 &&
                            this.pieChartData.datasets[0].data.some(value => value > 0);

                        this.pieChartOptions = {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            const dataset = context.dataset;
                                            const total = dataset.data.reduce((acc, data) => acc + data, 0);
                                            const value = dataset.data[context.dataIndex];
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return `${value} (${percentage}%)`;
                                        }
                                    }
                                }
                            }
                        };
                    }
                );
                break;

            case 'seat-votes':
                if (!this.sectionId || this.sectionId < 0)
                    break

                this.dashboardControllerService.globalSectionStats(this.sectionId).subscribe(
                    (voteResponse: VoteResponse) => {

                        let blankVotes = voteResponse.blanks ?? 0;
                        let nullVotes = voteResponse.nulls ?? 0;
                        let totalVotes = voteResponse.totalVotes ?? 0;
                        let validVotes = totalVotes - nullVotes - blankVotes;

                        this.pieChartData = {
                            labels: ["Schede Valide", "Schede Bianche", "Schede Nulle"],
                            datasets: [{
                                data: [validVotes, blankVotes, nullVotes],
                                backgroundColor: this.generateColors(3)
                            }]
                        };

                        this.hasData = this.pieChartData.datasets.length > 0 &&
                            this.pieChartData.datasets[0].data.some(value => value > 0);

                        this.pieChartOptions = {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            const dataset = context.dataset;
                                            const total = dataset.data.reduce((acc, data) => acc + data, 0);
                                            const value = dataset.data[context.dataIndex];
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return `${value} (${percentage}%)`;
                                        }
                                    }
                                }
                            }
                        };
                    }
                );
                break;

            case 'mayors':
                this.dashboardControllerService.mayorsTotalVotes().subscribe(
                    (candidates: CandidateDto[]) => {
                        this.pieChartData = {
                            labels: candidates.map(candidate => candidate.name),
                            datasets: [{
                                data: candidates.map(candidate => candidate.votes || 0), // Aggiungi || 0 per gestire possibili undefined
                                backgroundColor: this.generateColors(candidates.length)
                            }]
                        };

                        this.pieChartOptions = {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            const dataset = context.dataset;
                                            const total = dataset.data.reduce((acc, data) => acc + data, 0);
                                            const value = dataset.data[context.dataIndex];
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return `${value} (${percentage}%)`;
                                        }
                                    }
                                }
                            }
                        };

                        this.hasData = this.pieChartData.datasets.length > 0 &&
                            this.pieChartData.datasets[0].data.some(value => value > 0);
                    }
                );
                break;


            case 'seat-mayors':
                if (!this.sectionId || this.sectionId < 0)
                    break

                this.dashboardControllerService.globalSectionStats(this.sectionId).pipe(
                    map(data => data.mayors || [])
                ).subscribe(
                    (candidates: CandidateDto[]) => {
                        this.pieChartData = {
                            labels: candidates.map(candidate => candidate.name),
                            datasets: [{
                                data: candidates.map(candidate => candidate.votes || 0),
                                backgroundColor: this.generateColors(candidates.length)
                            }]
                        };
                        this.pieChartOptions = {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            const dataset = context.dataset;
                                            const total = dataset.data.reduce((acc, data) => acc + data, 0);
                                            const value = dataset.data[context.dataIndex];
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return `${value} (${percentage}%)`;
                                        }
                                    }
                                }
                            }
                        };
                        this.hasData = this.pieChartData.datasets.length > 0 &&
                            this.pieChartData.datasets[0].data.some(value => value > 0);
                    }

                );
                break;

            case 'default':
            default:
                this.dataService.getPieChartData().subscribe(data => {
                    this.pieChartData = data;
                });
                break;
        }
    }

    private generateColors(count: number): string[] {
        const colors = [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
        ];
        return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
    }

}

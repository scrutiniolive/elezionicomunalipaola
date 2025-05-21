import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, HostListener } from '@angular/core';
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
            <div class="chart-wrapper">
                <ng-container *ngIf="hasData; else noData">
                    <canvas baseChart
                        [data]="pieChartData"
                        [options]="pieChartOptions"
                        [type]="'pie'">
                    </canvas>
                </ng-container>
                <ng-template #noData>
                    <div class="no-data-message">
                        <p>Nessun dato disponibile</p>
                    </div>
                </ng-template>
            </div>
        </div>
    `,
    styles: [`
        .chart-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            
            h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #2c3e50;
                font-size: 16px;
            }
        }
        
        .chart-wrapper {
            flex: 1;
            position: relative;
            min-height: 0;
            max-height: 100%;
        }
        
        .no-data-message {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            min-height: 200px;
            background-color: #f8f9fa;
            border-radius: 8px;
            p {
                color: #6c757d;
                font-size: 1.1em;
            }
        }
        
        @media (max-width: 768px) {
            .chart-container h3 {
                font-size: 15px;
                margin-bottom: 10px;
            }
            
            .no-data-message p {
                font-size: 1em;
            }
        }
        
        @media (max-width: 480px) {
            .chart-container h3 {
                font-size: 14px;
                margin-bottom: 8px;
            }
            
            .no-data-message {
                min-height: 150px;
                
                p {
                    font-size: 0.9em;
                }
            }
        }
  `]
})
export class PieChartComponent implements OnInit, OnDestroy, OnChanges {
    @Input() dataSource: string = 'default';
    @Input() title: string = 'Distribuzione Dati';
    @Input() customData?: any;
    @Input() sectionId?: number;

    constructor(private dataService: DataService, private dashboardControllerService: DashboardControllerService) { }

    public hasData: boolean = false;
    private updateSubscription: Subscription | undefined;

    ngOnInit(): void {
        // Inizializza le opzioni del grafico in base alla dimensione dello schermo
        this.setupChartOptions();

        if (this.customData) {
            this.pieChartData = this.customData;
        } else {
            this.loadChartData();
            this.updateSubscription = interval(300000).subscribe(() => {
                this.loadChartData();
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadChartData();
    }

    ngOnDestroy() {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }

    @HostListener('window:resize')
    onResize() {
        this.setupChartOptions();
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
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: {
                        size: 12
                    }
                }
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

    private setupChartOptions() {
        const width = window.innerWidth;

        if (width <= 400) {
            // Per schermi molto stretti (circa 400px)
            this.pieChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 8,
                            padding: 5,
                            font: {
                                size: 10
                            }
                        }
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
                        },
                        bodyFont: {
                            size: 10
                        },
                        padding: 4
                    }
                }
            };
        } else if (width <= 768) {
            // Per tablet
            this.pieChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 10,
                            padding: 8,
                            font: {
                                size: 11
                            }
                        }
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
                        },
                        bodyFont: {
                            size: 11
                        },
                        padding: 6
                    }
                }
            };
        } else {
            // Per desktop
            this.pieChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            font: {
                                size: 12
                            }
                        }
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
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 8
                    }
                }
            };
        }
    }

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
                    }
                );
                break;

            case 'seat-votes':
                if (!this.sectionId || this.sectionId < 0)
                    break;

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
                    }
                );
                break;

            case 'mayors':
                this.dashboardControllerService.mayorsTotalVotes().subscribe(
                    (candidates: CandidateDto[]) => {
                        // Per i nomi lunghi su schermo piccolo
                        const width = window.innerWidth;
                        const labels = candidates.map(candidate => {
                            if (width <= 400 && candidate.name && candidate.name.length > 10) {
                                return candidate.name.substring(0, 8) + '...';
                            }
                            return candidate.name;
                        });

                        this.pieChartData = {
                            labels: labels,
                            datasets: [{
                                data: candidates.map(candidate => candidate.votes || 0),
                                backgroundColor: this.generateColors(candidates.length)
                            }]
                        };

                        this.hasData = this.pieChartData.datasets.length > 0 &&
                            this.pieChartData.datasets[0].data.some(value => value > 0);
                    }
                );
                break;

            case 'seat-mayors':
                if (!this.sectionId || this.sectionId < 0)
                    break;

                this.dashboardControllerService.globalSectionStats(this.sectionId).pipe(
                    map(data => data.mayors || [])
                ).subscribe(
                    (candidates: CandidateDto[]) => {
                        // Per i nomi lunghi su schermo piccolo
                        const width = window.innerWidth;
                        const labels = candidates.map(candidate => {
                            if (width <= 400 && candidate.name && candidate.name.length > 10) {
                                return candidate.name.substring(0, 8) + '...';
                            }
                            return candidate.name;
                        });

                        this.pieChartData = {
                            labels: labels,
                            datasets: [{
                                data: candidates.map(candidate => candidate.votes || 0),
                                backgroundColor: this.generateColors(candidates.length)
                            }]
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
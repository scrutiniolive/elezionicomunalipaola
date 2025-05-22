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
            <div *ngIf="hasData && showLegendBelow" class="chart-legend-below">
                <div *ngFor="let label of pieChartData.labels; let i = index" class="legend-item">
                    <span class="color-box" [style.background-color]="getColorForIndex(i)"></span>
                    <span class="label-text">{{label}}</span>
                </div>
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
                text-align: left; /* Centra il titolo */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        
        .chart-wrapper {
            flex: 1;
            position: relative;
            min-height: 0;
            max-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
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
        
        /* Nuovi stili per la legenda sotto il grafico */
        .chart-legend-below {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            padding: 8px 0;
            margin-top: 10px;
            
            .legend-item {
                display: flex;
                align-items: center;
                margin-right: 10px;
                margin-bottom: 5px;
                
                .color-box {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                    margin-right: 5px;
                }
                
                .label-text {
                    font-size: 12px;
                    color: #2c3e50;
                }
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
            
            .chart-legend-below {
                .legend-item .label-text {
                    font-size: 11px;
                }
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
            
            .chart-legend-below {
                gap: 4px;
                
                .legend-item {
                    margin-right: 6px;
                    
                    .color-box {
                        width: 10px;
                        height: 10px;
                        margin-right: 3px;
                    }
                    
                    .label-text {
                        font-size: 10px;
                    }
                }
            }
        }
        
        @media (max-width: 360px) {
            .chart-container h3 {
                font-size: 13px;
                margin-bottom: 6px;
            }
            
            .chart-legend-below {
                gap: 3px;
                
                .legend-item {
                    margin-right: 4px;
                    
                    .color-box {
                        width: 8px;
                        height: 8px;
                        margin-right: 2px;
                    }
                    
                    .label-text {
                        font-size: 9px;
                    }
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

    public showLegendBelow = false;
    public hasData: boolean = false;
    private updateSubscription: Subscription | undefined;
    private colors: string[] = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
    ];

    constructor(private dataService: DataService, private dashboardControllerService: DashboardControllerService) { }

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

    // Nuovo metodo per recuperare il colore in base all'indice per la legenda personalizzata
    getColorForIndex(index: number): string {
        return this.colors[index % this.colors.length];
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
        this.showLegendBelow = width <= 400; // Per schermi molto stretti, mostriamo la legenda sotto

        // Per schermi molto stretti (<= 360px), massimizza il grafico e usa legenda personalizzata
        if (width <= 360) {
            this.pieChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Nascondiamo la legenda integrata di Chart.js
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
                            size: 9
                        },
                        titleFont: {
                            size: 9
                        },
                        padding: 3,
                        boxWidth: 6
                    }
                },
                layout: {
                    padding: {
                        top: 5,
                        bottom: 5,
                        left: 5,
                        right: 5
                    }
                }
            };
        }
        else if (width <= 400) {
            this.pieChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Nascondiamo la legenda integrata di Chart.js
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
                },
                layout: {
                    padding: {
                        top: 5,
                        bottom: 10,
                        left: 5,
                        right: 5
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
            this.showLegendBelow = false; // Su desktop, usiamo la legenda standard di Chart.js
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
                        // Per i nomi lung su schermo piccolo
                        const width = window.innerWidth;
                        const labels = candidates.map(candidate => {
                            if (width <= 480 && candidate.name && candidate.name.length > 8) {
                                return candidate.name.substring(0, 6) + '..';
                            }
                            if (width <= 768 && candidate.name && candidate.name.length > 12) {
                                return candidate.name.substring(0, 10) + '..';
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
                            if (width <= 480 && candidate.name && candidate.name.length > 8) {
                                return candidate.name.substring(0, 6) + '..';
                            }
                            if (width <= 768 && candidate.name && candidate.name.length > 12) {
                                return candidate.name.substring(0, 10) + '..';
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
        return Array(count).fill(0).map((_, i) => this.colors[i % this.colors.length]);
    }
}
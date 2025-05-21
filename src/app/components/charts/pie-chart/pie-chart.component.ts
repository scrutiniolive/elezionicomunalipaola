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
    `,
    styles: [`
        .chart-container {
            h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #2c3e50;
            }
        }
        .no-data-message {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            background-color: #f8f9fa;
            border-radius: 8px;
            p {
                color: #6c757d;
                font-size: 1.1em;
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
            // Usa i dati personalizzati passati direttamente
            this.pieChartData = this.customData;
        } else {
            // Altrimenti carica i dati in base al dataSource
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
        // Importante: annulla la sottoscrizione quando il componente viene distrutto
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
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
        plugins: {
            legend: {
                position: 'right',
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
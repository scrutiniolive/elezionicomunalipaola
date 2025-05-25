import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { SectionsTurnoutDto, TurnoutControllerService } from '../../api';

Chart.register(...registerables);

@Component({
    selector: 'app-turnout',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './turnout.component.html',
    styleUrl: './turnout.component.scss'
})

export class TurnoutComponent implements OnInit, OnDestroy, OnChanges {
    @Input() dataSource: string = 'turnout';
    @Input() title: string = 'Affluenza per Sezione';
    @Input() sectionId?: number;

    constructor(private turnoutControllerService: TurnoutControllerService) { }

    public hasData: boolean = false;
    private updateSubscription: Subscription | undefined;

    @HostListener('window:resize')
    onResize() {
        this.setupChartOptions();
        setTimeout(() => {
            const charts = Chart.instances;
            for (const id in charts) {
                charts[id].resize();
            }
        }, 100);
    }

    getChartHeight(): string {
        const width = window.innerWidth;
        if (width <= 400) return '200px';
        if (width <= 768) return '240px';
        return '280px';
    }

    ngOnInit(): void {
        this.setupChartOptions();
        this.loadChartData();
        this.updateSubscription = interval(121 * 1000).subscribe(() => {
            this.loadChartData();
        });

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadChartData();

    }

    ngOnDestroy() {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }

    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Voti',
                backgroundColor: '#4BC0C0',
                borderColor: '#36A2EB',
                borderWidth: 1
            }
        ]
    };

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        scales: {
            x: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
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
                        const value = context.raw as number;
                        return `Voti: ${value}`;
                    }
                }
            }
        }
    };

    private setupChartOptions() {
        const width = window.innerWidth;

        // Configurazione base per tutte le dimensioni
        let options: ChartConfiguration<'bar'>['options'] = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
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
                            const value = context.raw as number;
                            return `Voti: ${value}`;
                        }
                    }
                }
            }
        };

        // Adattamenti per dispositivi più piccoli
        if (width <= 400) {
            options = {
                ...options,
                plugins: {
                    ...options.plugins,
                    legend: {
                        ...options.plugins?.legend,
                        labels: {
                            boxWidth: 8,
                            padding: 5,
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                scales: {
                    ...options.scales,
                    ['x']: {
                        ...(options.scales ? options.scales['x'] : {}),
                        ticks: {
                            ...(options.scales && options.scales['x'] ? options.scales['x'].ticks : {}),
                            maxRotation: 90,
                            font: {
                                size: 8
                            }
                        }
                    },
                    ['y']: {
                        ...(options.scales ? options.scales['y'] : {}),
                        ticks: {
                            ...(options.scales && options.scales['y'] ? options.scales['y'].ticks : {}),
                            font: {
                                size: 8
                            }
                        }
                    }
                }
            };
        } else if (width <= 768) {
            options = {
                ...options,
                plugins: {
                    ...options.plugins,
                    legend: {
                        ...options.plugins?.legend,
                        labels: {
                            boxWidth: 10,
                            padding: 8,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                scales: {
                    ...options.scales,
                    ['x']: {
                        ...(options.scales ? options.scales['x'] : {}),
                        ticks: {
                            ...(options.scales && options.scales['x'] ? options.scales['x'].ticks : {}),
                            maxRotation: 60,
                            font: {
                                size: 10
                            }
                        }
                    },
                    ['y']: {
                        ...(options.scales ? options.scales['y'] : {}),
                        ticks: {
                            ...(options.scales && options.scales['y'] ? options.scales['y'].ticks : {}),
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            };
        }

        this.barChartOptions = options;
    }

    private loadChartData(): void {


        switch (this.dataSource) {
            case 'turnout':
                this.turnoutControllerService.getTurnout().subscribe(data => {
                    this.processTurnoutData(data);
                    this.hasData = this.barChartData.datasets.length > 0 &&
                        this.barChartData.datasets[0].data.some(value => value ?? 0 > 0);
                });
                break;

            case 'turnout-votes':
                this.turnoutControllerService.getTurnout().subscribe(data => {
                    this.processTurnoutVotesData(data);
                    this.hasData = this.barChartData.datasets.length > 0 &&
                        this.barChartData.datasets[0].data.some(value => value ?? 0 > 0);
                });
                break;


            case 'default':
            default:
                break;
        }


    }
    processTurnoutVotesData(data: SectionsTurnoutDto) {
        if (!data || !data.sectionTurnoutDtoList || data.sectionTurnoutDtoList.length === 0) {
            this.hasData = false;
            return;
        }

        const sectionList = data.sectionTurnoutDtoList;

        // Estrai sectionName e votingPercentage dal formato SectionTurnoutDto
        const labels = sectionList.map(item => item.sectionName);
        const values = sectionList.map(item => item.votingElectors !== undefined ? item.votingElectors : null);

        this.barChartData = {
            labels: labels,
            datasets: [
                {
                    data: values,
                    label: 'Votanti',
                    backgroundColor: this.generateBarColors(sectionList.length),
                    borderColor: '#36A2EB',
                    borderWidth: 1
                }
            ]
        };

        this.hasData = labels.length > 0 && values.some(val => val ?? 0 > 0);
    }





    processTurnoutData(data: SectionsTurnoutDto) {
        if (!data || !data.sectionTurnoutDtoList || data.sectionTurnoutDtoList.length === 0) {
            this.hasData = false;
            return;
        }

        const sectionList = data.sectionTurnoutDtoList;

        // Estrai sectionName e votingPercentage dal formato SectionTurnoutDto
        const labels = sectionList.map(item => item.sectionName);
        const values = sectionList.map(item => item.votingPercentage !== undefined ? item.votingPercentage : null);

        this.barChartData = {
            labels: labels,
            datasets: [
                {
                    data: values,
                    label: 'Affluenza (%)',
                    backgroundColor: this.generateBarColors(sectionList.length),
                    borderColor: '#36A2EB',
                    borderWidth: 1
                }
            ]
        };

        this.hasData = labels.length > 0 && values.some(val => val ?? 0 > 0);
    }

    private generateBarColors(count: number): string[] {
        const colors = ['#FF1F54', // Rosa scuro
            '#4BC0C0', // Turchese
            '#36A2EB', // Blu
            '#FFCE56', // Giallo
            '#FF6384', // Rosa
            '#9966FF', // Viola
            '#FF9F40', // Arancione

            // 11 colori aggiuntivi in palette coordinata
            '#59D4D4', // Turchese più chiaro
            '#2D88C9', // Blu più scuro
            '#63CAFF', // Azzurro chiaro
            '#FFB930', // Giallo ambrato
            '#FFDE7C', // Giallo pallido
            '#FF8FA6', // Rosa chiaro
            '#E14969', // Rosa scuro
            '#7F4FD6', // Viola medio
            '#B088FF', // Lilla
            '#FF8B17', // Arancione bruciato
            '#FFBA70'  // Pesca
        ];
        // Genera colori per tutte le barre
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        return result;
    }
}




import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor() { }




    // Dati per i contatori
    getCounterData(): Observable<any[]> {
        return of([
            { title: 'Utenti', value: 1254, icon: 'users', prefix: '' },
            { title: 'Vendite', value: 8547, icon: 'shopping-cart', prefix: '€' },
            { title: 'Ordini', value: 384, icon: 'box', prefix: '' },
            { title: 'Visite', value: 9841, icon: 'chart-line', prefix: '' }
        ]);
    }

    // Dati per il grafico a torta
    getPieChartData(): Observable<any> {
        return of({
            labels: ['Prodotto A', 'Prodotto B', 'Prodotto C', 'Prodotto D'],
            datasets: [{
                data: [300, 450, 250, 180],
                backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c']
            }]
        });
    }

    // Dati per il grafico a barre
    getBarChartData(): Observable<any> {
        return of({
            labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
            datasets: [
                {
                    data: [65, 59, 80, 81, 56, 55],
                    label: 'Serie A',
                    backgroundColor: '#3498db',
                },
                {
                    data: [28, 48, 40, 19, 86, 27],
                    label: 'Serie B',
                    backgroundColor: '#2ecc71',
                }
            ]
        });
    }

    // Dati per il grafico a linea
    getLineChartData(): Observable<any> {
        return of({
            labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            datasets: [
                {
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 62, 89, 91],
                    label: 'Vendite 2024',
                    fill: false,
                    borderColor: '#3498db',
                    tension: 0.1
                },
                {
                    data: [45, 42, 60, 70, 46, 48, 35, 55, 65, 58, 79, 80],
                    label: 'Vendite 2023',
                    fill: false,
                    borderColor: '#e74c3c',
                    tension: 0.1
                }
            ]
        });
    }
}
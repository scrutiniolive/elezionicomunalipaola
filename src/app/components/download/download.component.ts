import { Component, OnInit, OnDestroy } from "@angular/core";
import { DashboardControllerService, VoteControllerService } from "../../api";
import { AuthService } from "../../services/auth.service";
import { Subscription, interval } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class DownloadComponent implements OnInit, OnDestroy {
    //isAuthenticated = false;
    countdownDisplay = '';
    private endDate = new Date('May 28, 2025 00:00:00').getTime();
    private countdownSubscription!: Subscription;
    private authSubscription!: Subscription;

    constructor(
        private voteControllerService: VoteControllerService,
        private dashboardControllerService: DashboardControllerService,
        private authService: AuthService
    ) { }

    ngOnInit() {

        // Avvio del countdown
        this.countdownSubscription = interval(121 * 1000).subscribe(() => {
            this.updateCountdown();
        });

        // Inizializza il contatore subito
        this.updateCountdown();
    }

    ngOnDestroy() {
        // Pulisci le sottoscrizioni quando il componente viene distrutto
        if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
        }
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    downloadExcel() {


        this.dashboardControllerService.exportToExcel()
            .subscribe({
                next: (response) => {
                    // Crea un blob dall'array buffer
                    const blob = new Blob([response], { type: 'application/vnd.ms-excel' });

                    // Crea un URL oggetto per il blob
                    const url = window.URL.createObjectURL(blob);

                    // Crea un elemento link nascosto
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'risultati_voto.xlsx'; // Nome del file

                    // Aggiungi il link al documento
                    document.body.appendChild(link);

                    // Simula il click sul link
                    link.click();

                    // Rimuovi il link dal documento
                    document.body.removeChild(link);

                    // Libera l'URL oggetto
                    window.URL.revokeObjectURL(url);
                },
                error: (error) => {
                    console.error('Errore durante il download:', error);
                    // Gestisci l'errore (mostra un messaggio all'utente)
                }
            });
    }

    private updateCountdown() {
        const now = new Date().getTime();
        const distance = this.endDate - now;

        if (distance < 0) {
            this.countdownDisplay = "Scaduto";
            return;
        }

        // Calcola giorni, ore, minuti e secondi
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.countdownDisplay = `${days}g ${hours}h ${minutes}m ${seconds}s`;
    }
}
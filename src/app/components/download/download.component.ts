import { Component } from "@angular/core";
import { VoteControllerService } from "../../api";

@Component({
    selector: 'app-download',
    template: `
    <div class="download-container">
      <button (click)="downloadExcel()" class="download-button">
        Scarica Report Excel
      </button>
    </div>
  `,
    styles: [`
    .download-container {
      padding: 20px;
      text-align: center;
    }
    .download-button {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .download-button:hover {
      background-color: #45a049;
    }
  `]
})
export class DownloadComponent {
    constructor(private voteControllerService: VoteControllerService) { }

    downloadExcel() {
        this.voteControllerService.exportToExcel()
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
}
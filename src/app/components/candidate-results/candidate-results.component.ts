import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyListCardModel } from '../../api/model/partyListCardModel';
import { CardControllerService } from '../../api/api/cardController.service';
import { PartyContainerComponent } from '../party-container/party-container.component';




@Component({
    selector: 'app-candidate-results',
    standalone: true,
    imports: [CommonModule, PartyContainerComponent],
    templateUrl: './candidate-results.component.html',
    styleUrl: './candidate-results.component.scss'
})
export class CandidateResultsComponent {

    parties: PartyListCardModel[] = [];
    loading = false;
    error = '';
    showCounter = false

    constructor(
        private cardControllerService: CardControllerService,
    ) { }

    ngOnInit(): void {
        this.loadParties();
    }

    loadParties(): void {
        this.loading = true;
        this.error = '';

        this.cardControllerService.getCandidateResultsPartyListCards()
            .subscribe({
                next: (data) => {
                    this.parties = data
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Errore nel caricamento dei dati: ' + (err.error?.message || err.message);
                    this.loading = false;
                }
            });
    }

}

// seat.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyListCardModel } from '../../api/model/partyListCardModel';
import { CardControllerService } from '../../api/api/cardController.service';
import { PartyContainerComponent } from '../party-container/party-container.component';

@Component({
    selector: 'app-seat',
    standalone: true,
    imports: [CommonModule, PartyContainerComponent],
    templateUrl: './candidate.component.html',
    styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
    parties: PartyListCardModel[] = [];
    loading = false;
    error = '';

    constructor(
        private cardControllerService: CardControllerService,
    ) { }

    ngOnInit(): void {
        this.loadParties();
    }

    loadParties(): void {
        this.loading = true;
        this.error = '';

        this.cardControllerService.getPartyListCards()
            .subscribe({
                next: (data) => {
                    this.parties = data.sort((a, b) => {

                        return (a.name ?? '').localeCompare(b.name ?? '');


                    })
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Errore nel caricamento dei dati: ' + (err.error?.message || err.message);
                    this.loading = false;
                }
            });
    }


}
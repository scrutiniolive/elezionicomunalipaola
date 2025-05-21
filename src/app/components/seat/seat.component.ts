import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PartyListCardModel } from '../../api/model/partyListCardModel';
import { VoteRequest } from '../../api/model/voteRequest';
import { CardControllerService } from '../../api/api/cardController.service';
import { VoteControllerService } from '../../api/api/voteController.service';
import { AuthService } from '../../services/auth.service';
import { PartyColumnComponent } from '../party-column/party-column.component';
import { finalize } from 'rxjs/operators';
import { DashboardControllerService, ElectionDisplayControllerService, SectionControllerService } from '../../api';

@Component({
    selector: 'app-seat',
    standalone: true,
    imports: [CommonModule, PartyColumnComponent],
    templateUrl: './seat.component.html',
    styleUrls: ['./seat.component.scss']
})
export class SeatComponent implements OnInit {
    partyListCardModels: PartyListCardModel[] = [];
    loading = false;
    error = '';
    nullVotes = 0;
    blankVotes = 0;
    sectionName = ''
    sectionId = -1;
    ballotOpen = false;



    constructor(
        private cardControllerService: CardControllerService,
        private voteControllerService: VoteControllerService,
        private dashboardControllerService: DashboardControllerService,
        private displayControllerService: ElectionDisplayControllerService,
        private authService: AuthService,
        private sectionControllerService: SectionControllerService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadSeatInfo();
    }

    loadSeatInfo() {
        this.displayControllerService.sectionBaseInfo().subscribe({
            next: (data) => {
                this.sectionId = data.id ?? -1;
                this.sectionName = 'Seggio: ' + (data.name ?? '');
                this.ballotOpen = data.ballotOpen ?? false;
                this.loadParties();
            },
            error: (err) => {
                switch (err.status) {
                    case 401:
                        this.authService.logout();
                        this.router.navigate(['/seats/login']);
                        break;
                    default:
                        this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                }
            }
        });
    }

    loadParties(): void {
        this.loading = true;
        this.error = '';

        this.dashboardControllerService.globalSectionStats(this.sectionId).subscribe({
            next: (data) => {
                this.nullVotes = data.nulls ?? 0;
                this.blankVotes = data.blanks ?? 0;
            },
            error: (err) => {
                switch (err.status) {
                    case 401:
                        this.authService.logout();
                        this.router.navigate(['/seats/login']);
                        break;
                    default:
                        this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                }
            }
        });

        this.cardControllerService.getSectionPartyListCards()
            .pipe(
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (data) => {
                    this.partyListCardModels = data;
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/seats/login']);
    }

    // Gestione dell'incremento del contatore
    onIncrementCounter(candidateId: number): void {
        const voteRequest: VoteRequest = { candidateId: candidateId, deleted: false, blankVote: false, nullVote: false };
        this.partyListCardModels.forEach(party => {
            const candidate = party.candidateModels?.find(c => c.id === candidateId);
            if (candidate) {
                this.voteControllerService.insertVote(voteRequest)
                    .subscribe({
                        next: (data) => {
                            candidate.counter = (candidate.counter || 0) + 1;
                        },
                        error: (err) => {
                            switch (err.status) {
                                case 401:
                                    this.authService.logout();
                                    this.router.navigate(['/seats/login']);
                                    break;
                                default:
                                    this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                            }
                        }
                    });
            }
        });
    }

    // Gestione del decremento del contatore
    onDecrementCounter(candidateId: number): void {
        const voteRequest: VoteRequest = { candidateId: candidateId, deleted: false, blankVote: false, nullVote: false };
        this.partyListCardModels.forEach(party => {
            const candidate = party.candidateModels?.find(c => c.id === candidateId);
            if (candidate && (candidate.counter || 0) > 0) {
                this.voteControllerService.insertVote(voteRequest)
                    .subscribe({
                        next: (data) => {
                            candidate.counter = (candidate.counter || 0) - 1;
                        },
                        error: (err) => {
                            switch (err.status) {
                                case 401:
                                    this.authService.logout();
                                    this.router.navigate(['/seats/login']);
                                    break;
                                default:
                                    this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                            }
                        }
                    });
            }
        });
    }

    // Gestione del decremento del contatore
    onSetCounter(candidateId: number, value: number): void {
        const voteRequest: VoteRequest = { candidateId: candidateId, deleted: false, blankVote: false, nullVote: false };
        this.partyListCardModels.forEach(party => {
            const candidate = party.candidateModels?.find(c => c.id === candidateId);
            if (candidate && value && value >= 0) {
                this.voteControllerService.insertVote(voteRequest)
                    .subscribe({
                        next: (data) => {
                            candidate.counter = (candidate.counter || 0) - 1;
                        },
                        error: (err) => {
                            switch (err.status) {
                                case 401:
                                    this.authService.logout();
                                    this.router.navigate(['/seats/login']);
                                    break;
                                default:
                                    this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                            }
                        }
                    });
            }
        });
    }


    onNullVotesClick(): void {
        const voteRequest: VoteRequest = { deleted: false, blankVote: false, nullVote: true };
        this.voteControllerService.insertVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.nullVotes++;
                    console.log(`Voti nulli incrementati: ${this.nullVotes}`);
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }




    onBlankVotesClick(): void {
        const voteRequest: VoteRequest = { deleted: false, blankVote: true, nullVote: false };
        this.voteControllerService.insertVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.blankVotes++;
                    console.log(`Voti nulli incrementati: ${this.nullVotes}`);
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }

    // Opzionale: metodi per decrementare i voti speciali
    decrementNullVotes(): void {
        const voteRequest: VoteRequest = { deleted: true, blankVote: false, nullVote: true };
        this.voteControllerService.insertVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.nullVotes--;
                    console.log(`Voti nulli incrementati: ${this.nullVotes}`);
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }

    decrementBlankVotes(): void {
        const voteRequest: VoteRequest = { deleted: true, blankVote: true, nullVote: false };
        this.voteControllerService.insertVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.blankVotes--;
                    console.log(`Voti nulli incrementati: ${this.nullVotes}`);
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }

    toggleBallot() {

        this.sectionControllerService.updateBallot({ id: this.sectionId, ballotOpen: !this.ballotOpen })
            .subscribe({
                next: (data) => {
                    this.ballotOpen = !this.ballotOpen;
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Stato sessione non modificato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }
}
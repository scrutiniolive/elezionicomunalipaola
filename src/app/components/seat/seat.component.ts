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
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-seat',
    standalone: true,
    imports: [CommonModule, PartyColumnComponent, FormsModule],
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

    tempNullVotes = 0;
    tempBlankVotes = 0;



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
                    case 403:
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
                this.tempBlankVotes = this.blankVotes;
                this.tempNullVotes = this.nullVotes;
            },
            error: (err) => {
                switch (err.status) {
                    case 401:
                    case 403:
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
                        case 403:
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


    onEnterPressedOnBlank(inputElement: HTMLInputElement) {
        inputElement.blur();
    }

    onEscapePressedOnBlank(inputElement: HTMLInputElement) {
        this.tempBlankVotes = this.blankVotes ?? 0;
        inputElement.blur();
    }

    onEnterPressedOnNull(inputElement: HTMLInputElement) {
        inputElement.blur();
    }

    onEscapePressedOnNull(inputElement: HTMLInputElement) {
        this.tempNullVotes = this.nullVotes ?? 0;
        inputElement.blur();
    }


    incrementNullVotesClick(): void {
        const voteRequest: VoteRequest = { deleted: false, blankVote: false, nullVote: true };
        this.voteControllerService.insertSingleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.nullVotes = data.totalVotes ?? 0;
                    this.tempNullVotes = data.totalVotes ?? 0;
                    console.log(`Voti nulli incrementati: ${this.nullVotes}`);
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                        case 403:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }




    incrementBlankVotesClick(): void {
        const voteRequest: VoteRequest = { deleted: false, blankVote: true, nullVote: false };
        this.voteControllerService.insertSingleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.blankVotes = data.totalVotes ?? 0;
                    this.tempBlankVotes = data.totalVotes ?? 0;
                    console.log(`Voti nulli incrementati: ${this.nullVotes}`);
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                        case 403:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Voto non caricato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }

    decrementNullVotes(): void {
        const voteRequest: VoteRequest = { deleted: true, blankVote: false, nullVote: true };
        this.voteControllerService.insertSingleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.nullVotes = data.totalVotes ?? 0;
                    this.tempNullVotes = data.totalVotes ?? 0;
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                        case 403:
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
        this.voteControllerService.insertSingleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.nullVotes = data.totalVotes ?? 0;
                    this.tempNullVotes = data.totalVotes ?? 0;
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                        case 403:
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
                        case 403:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            this.error = 'Stato sessione non modificato: ' + (err.error?.message || err.message);
                    }
                }
            });
    }

    onSetCounterOnBlank(): void {

        if (!this.tempBlankVotes || isNaN(this.tempBlankVotes) || this.tempBlankVotes < 0 || this.tempBlankVotes === this.blankVotes) {
            this.tempBlankVotes = this.blankVotes ?? 0;
            return;
        }
        const voteRequest: VoteRequest = { deleted: false, blankVote: true, nullVote: false, totalVotes: Math.floor(this.tempBlankVotes) };
        this.voteControllerService.insertMultipleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.blankVotes = data.totalVotes ?? 0;
                    this.tempBlankVotes = data.totalVotes ?? 0;
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                        case 403:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            console.log(err.err)
                    }
                }
            });

    }

    onSetCounterOnNull(): void {

        if (!this.tempNullVotes || isNaN(this.tempNullVotes) || this.tempNullVotes < 0 || this.tempNullVotes === this.nullVotes) {
            this.tempNullVotes = this.nullVotes ?? 0;
            return;
        }
        const voteRequest: VoteRequest = { deleted: false, blankVote: false, nullVote: true, totalVotes: Math.floor(this.tempNullVotes) };
        this.voteControllerService.insertMultipleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.nullVotes = data.totalVotes ?? 0;
                    this.tempNullVotes = data.totalVotes ?? 0;
                },
                error: (err) => {
                    switch (err.status) {
                        case 401:
                        case 403:
                            this.authService.logout();
                            this.router.navigate(['/seats/login']);
                            break;
                        default:
                            console.log(err.err)
                    }
                }
            });

    }
}
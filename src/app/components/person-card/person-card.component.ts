// person-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonCard } from '../../models/seat.models';
import { CandidateCardModel, VoteControllerService, VoteRequest } from '../../api';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';




@Component({
    selector: 'app-person-card',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './person-card.component.html',
    styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent {


    @Input() showCounter: boolean = false;
    @Input() isEditable: boolean = false;
    @Input() ballotOpen: boolean = false;
    @Input() isCandidate: boolean = true;

    constructor(private imageService: ImageService, private voteControllerService: VoteControllerService, private authService: AuthService, private router: Router) { };

    imageUrl?: string;
    imagesLoaded = false;
    tempCounter = 0;
    tempNullVotes = 0;
    tempBlankVotes = 0;

    ngOnInit() {
        this.tempCounter = this.candidateCardModel.counter ?? 0;
        this.imageService.isLoaded().subscribe(loaded => {
            this.imagesLoaded = loaded;
            if (loaded && this.candidateCardModel.id) {
                this.imageUrl = this.imageService.getImage(this.candidateCardModel.id);
            }
        });
    }

    @Input() candidateCardModel!: CandidateCardModel;
    @Output() increment = new EventEmitter<number>();
    @Output() decrement = new EventEmitter<number>();

    onIncrement(): void {
        this.increment.emit(this.candidateCardModel.id);
    }

    onDecrement(): void {
        this.decrement.emit(this.candidateCardModel.id);
    }



    incrementVotes(): void {
        const voteRequest: VoteRequest = { candidateId: this.candidateCardModel.id, deleted: false, blankVote: false, nullVote: false };
        this.voteControllerService.insertSingleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.candidateCardModel.counter = data.totalVotes ?? 0;
                    this.tempCounter = data.totalVotes ?? 0;
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

    decrementVotes(): void {
        const voteRequest: VoteRequest = { candidateId: this.candidateCardModel.id, deleted: true, blankVote: false, nullVote: false };
        this.voteControllerService.insertSingleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.candidateCardModel.counter = data.totalVotes ?? 0;
                    this.tempCounter = data.totalVotes ?? 0;
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



    onCounterChange(): void {
        if (!this.tempCounter || isNaN(this.tempCounter) || this.tempCounter < 0 || this.tempCounter === this.candidateCardModel.counter) {
            this.tempCounter = this.candidateCardModel.counter ?? 0;
            return;
        }
        const voteRequest: VoteRequest = { candidateId: this.candidateCardModel.id, deleted: false, blankVote: false, nullVote: false, totalVotes: Math.floor(this.tempCounter) };
        this.voteControllerService.insertMultipleVote(voteRequest)
            .subscribe({
                next: (data) => {
                    this.candidateCardModel.counter = data.totalVotes ?? 0;
                    this.tempCounter = data.totalVotes ?? 0;
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

    onEnterPressed(inputElement: HTMLInputElement) {
        inputElement.blur();
    }

    onEscapePressed(inputElement: HTMLInputElement) {
        this.tempCounter = this.candidateCardModel.counter ?? 0;
        inputElement.blur();
    }



    onEnterPressedOnBlankOrNull(inputElement: HTMLInputElement) {
        inputElement.blur();
    }

    onEscapePressedOnBlankOrNull(inputElement: HTMLInputElement) {
        if (this.candidateCardModel.id == -1) {
            this.tempNullVotes = this.candidateCardModel.counter ?? 0;
        } else {
            this.tempBlankVotes = this.candidateCardModel.counter ?? 0;
        }
        inputElement.blur();
    }




    onCounterChangeBlankOrNull() {
        if (this.candidateCardModel.id == -1) {
            if (!this.tempNullVotes || isNaN(this.tempNullVotes) || this.tempNullVotes < 0 || this.tempNullVotes === this.candidateCardModel.counter) {
                this.tempNullVotes = this.candidateCardModel.counter ?? 0;
                return;
            }
            const voteRequest: VoteRequest = { deleted: false, blankVote: false, nullVote: true, totalVotes: Math.floor(this.tempNullVotes) };
            this.voteControllerService.insertMultipleVote(voteRequest)
                .subscribe({
                    next: (data) => {
                        this.candidateCardModel.counter = data.totalVotes ?? 0;
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
                })
        } else {
            if (!this.tempBlankVotes || isNaN(this.tempBlankVotes) || this.tempBlankVotes < 0 || this.tempBlankVotes === this.candidateCardModel.counter) {
                this.tempBlankVotes = this.candidateCardModel.counter ?? 0;
                return;
            }
            const voteRequest: VoteRequest = { deleted: false, blankVote: true, nullVote: false, totalVotes: Math.floor(this.tempBlankVotes) };
            this.voteControllerService.insertMultipleVote(voteRequest)
                .subscribe({
                    next: (data) => {
                        this.candidateCardModel.counter = data.totalVotes ?? 0;
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
    }
    decrementEitherNullOrBlank() {
        if (this.candidateCardModel.id == -1) {
            const voteRequest: VoteRequest = { deleted: true, blankVote: false, nullVote: true };
            this.voteControllerService.insertSingleVote(voteRequest)
                .subscribe({
                    next: (data) => {
                        this.candidateCardModel.counter = data.totalVotes ?? 0;
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
                                console.log(err.error?.message)
                        }
                    }
                });
        } else {
            const voteRequest: VoteRequest = { deleted: true, blankVote: true, nullVote: false };
            this.voteControllerService.insertSingleVote(voteRequest)
                .subscribe({
                    next: (data) => {
                        this.candidateCardModel.counter = data.totalVotes ?? 0;
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
                                console.log(err.error?.message)
                        }
                    }
                });
        }
    }
    incrementeEitherNullOrBlank() {
        if (this.candidateCardModel.id == -1) {
            const voteRequest: VoteRequest = { deleted: false, blankVote: false, nullVote: true };
            this.voteControllerService.insertSingleVote(voteRequest)
                .subscribe({
                    next: (data) => {
                        this.candidateCardModel.counter = data.totalVotes ?? 0;
                        this.tempNullVotes = data.totalVotes ?? 0;
                        console.log(`Voti nulli incrementati: ${this.candidateCardModel.counter}`);
                    },
                    error: (err) => {
                        switch (err.status) {
                            case 401:
                            case 403:
                                this.authService.logout();
                                this.router.navigate(['/seats/login']);
                                break;
                            default:
                                console.log(err.error?.message)
                        }
                    }
                });
        } else {
            const voteRequest: VoteRequest = { deleted: false, blankVote: true, nullVote: false };
            this.voteControllerService.insertSingleVote(voteRequest)
                .subscribe({
                    next: (data) => {
                        this.candidateCardModel.counter = data.totalVotes ?? 0;
                        this.tempBlankVotes = data.totalVotes ?? 0;
                        console.log(`Voti nulli incrementati: ${this.candidateCardModel.counter}`);
                    },
                    error: (err) => {
                        switch (err.status) {
                            case 401:
                            case 403:
                                this.authService.logout();
                                this.router.navigate(['/seats/login']);
                                break;
                            default:
                                console.log(err.error?.message)
                        }
                    }
                });
        }
    }


}





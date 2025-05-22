// person-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateCardModel, VoteControllerService, VoteRequest } from '../../api';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-person-card-seat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './person-card-seat.component.html',
    styleUrls: ['./person-card-seat.component.scss']
})

export class PersonCardSeatComponent {
    @Input() candidateCardModel!: CandidateCardModel;
    @Input() ballotOpen: boolean = false;

    imageUrl?: string;
    imagesLoaded = false;
    tempCounter: number = 0;


    constructor(private imageService: ImageService, private voteControllerService: VoteControllerService, private authService: AuthService,
        private router: Router) { }



    ngOnInit() {
        this.tempCounter = this.candidateCardModel.counter ?? 0;

        this.imageService.isLoaded().subscribe(loaded => {
            this.imagesLoaded = loaded;
            if (loaded && this.candidateCardModel.id) {
                this.imageUrl = this.imageService.getImage(this.candidateCardModel.id);
            }
        });
    }

    onIncrementCounter(): void {
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

    onDecrementCounter(): void {
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

    onEnterPressed(inputElement: HTMLInputElement) {
        inputElement.blur();
    }

    onEscapePressed(inputElement: HTMLInputElement) {
        this.tempCounter = this.candidateCardModel.counter ?? 0;
        inputElement.blur();
    }


    onSetCounter(): void {

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

}
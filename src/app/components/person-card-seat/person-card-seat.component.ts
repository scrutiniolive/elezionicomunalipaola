// person-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateCardModel } from '../../api';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-person-card-seat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './person-card-seat.component.html',
    styleUrls: ['./person-card-seat.component.scss']
})

export class PersonCardSeatComponent {

    tempCounter: number = 0;

    constructor(private imageService: ImageService) { }

    @Input() candidateCardModel!: CandidateCardModel;
    @Input() ballotOpen: boolean = false;
    @Output() increment = new EventEmitter<number>();
    @Output() decrement = new EventEmitter<number>();

    imageUrl?: string;
    imagesLoaded = false;

    ngOnInit() {
        this.tempCounter = this.candidateCardModel.counter ?? 0;

        this.imageService.isLoaded().subscribe(loaded => {
            this.imagesLoaded = loaded;
            if (loaded && this.candidateCardModel.id) {
                this.imageUrl = this.imageService.getImage(this.candidateCardModel.id);
            }
        });
    }

    onIncrement(event: Event): void {
        // Ferma la propagazione dell'evento per evitare che si attivi anche l'evento click della card
        event.stopPropagation();
        this.tempCounter = this.tempCounter + 1;

        this.validateAndUpdate();
    }



    onDecrement(event: Event): void {
        // Ferma la propagazione dell'evento
        console.log(`PersonCardSeatComponent Pulsante incremento cliccato ${this.candidateCardModel.id}`);
        event.stopPropagation();
        this.tempCounter = this.tempCounter - 1;
        this.validateAndUpdate()
    }

    validateAndUpdate() {
        const value = this.tempCounter;

        // Se il valore è NaN (non un numero) o negativo, ripristina il valore precedente
        if (isNaN(value) || value < 0) {
            this.tempCounter = this.candidateCardModel.counter ?? 0;
            return;
        }

        if (!value) {
            this.tempCounter = this.candidateCardModel.counter ?? 0
        }

        this.tempCounter = Math.floor(this.tempCounter);

        if (this.tempCounter !== this.candidateCardModel.counter) {

            let diff = (this.candidateCardModel.counter ?? 0) - this.tempCounter
            if (diff > 0) {

                for (let index = 0; index < diff; index++) {
                    this.decrement.emit(
                        this.candidateCardModel.id
                    );

                }

            } else {
                for (let index = 0; index < -1 * diff; index++) {
                    this.increment.emit(
                        this.candidateCardModel.id
                    );
                }



            }
        }

    }

}
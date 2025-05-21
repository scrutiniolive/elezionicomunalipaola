// person-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateCardModel } from '../../api';
import { ImageService } from '../../services/image.service';

@Component({
    selector: 'app-person-card-seat',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './person-card-seat.component.html',
    styleUrls: ['./person-card-seat.component.scss']
})

export class PersonCardSeatComponent {

    constructor(private imageService: ImageService) { }

    @Input() candidateCardModel!: CandidateCardModel;
    @Input() ballotOpen: boolean = false;
    @Output() increment = new EventEmitter<number>();
    @Output() decrement = new EventEmitter<number>();

    imageUrl?: string;
    imagesLoaded = false;

    ngOnInit() {
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
        this.increment.emit(
            this.candidateCardModel.id
        );
    }

    onDecrement(event: Event): void {
        // Ferma la propagazione dell'evento
        console.log(`PersonCardSeatComponent Pulsante incremento cliccato ${this.candidateCardModel.id}`);
        event.stopPropagation();
        this.decrement.emit(
            this.candidateCardModel.id
        );
    }
}
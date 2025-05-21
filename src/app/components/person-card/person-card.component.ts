// person-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonCard } from '../../models/seat.models';
import { CandidateCardModel } from '../../api';
import { ImageService } from '../../services/image.service';



@Component({
    selector: 'app-person-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './person-card.component.html',
    styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent {

    @Input() showCounter: boolean = false;

    constructor(private imageService: ImageService) { };

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

    @Input() candidateCardModel!: CandidateCardModel;
    @Output() increment = new EventEmitter<number>();
    @Output() decrement = new EventEmitter<number>();

    onIncrement(): void {
        this.increment.emit(this.candidateCardModel.id);
    }

    onDecrement(): void {
        this.decrement.emit(this.candidateCardModel.id);
    }
}




// person-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonCard } from '../../models/seat.models';
import { CandidateCardModel } from '../../api';
import { ImageService } from '../../services/image.service';



@Component({
    selector: 'app-person-card-no-counter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './person-card-no-counter.component.html',
    styleUrls: ['./person-card-no-counter.component.scss']
})
export class PersonCardComponentNoCounter {

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

}




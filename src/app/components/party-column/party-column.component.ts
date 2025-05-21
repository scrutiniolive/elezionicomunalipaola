import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonCardSeatComponent } from '../person-card-seat/person-card-seat.component';
import { PartyListCardModel } from '../../api/model/partyListCardModel';


@Component({
    selector: 'app-party-column',
    standalone: true,
    imports: [CommonModule, PersonCardSeatComponent],
    templateUrl: './party-column.component.html',
    styleUrls: ['./party-column.component.scss']
})
export class PartyColumnComponent {
    @Input() partyListCardModel!: PartyListCardModel;
    @Input() ballotOpen: boolean = false;
    @Input() showCounter: boolean = false;
    @Output() iconClick = new EventEmitter<void>();
    @Output() incrementCounter = new EventEmitter<number>();
    @Output() decrementCounter = new EventEmitter<number>();

    onIconClick(): void {
        this.iconClick.emit();
    }

    onIncrementCounter(id: number): void {

        console.log(`PartyColumn Pulsante incremento cliccato ${id}`);
        this.incrementCounter.emit(id);
    }

    onDecrementCounter(id: number): void {
        console.log(`PartyColumn Pulsante decremetno cliccato ${id}`);
        this.decrementCounter.emit(id);
    }


}
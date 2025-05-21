// party-container.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonCardComponent } from '../person-card/person-card.component';
import { Party, PersonCard } from '../../models/seat.models';
import { SeatService } from '../../services/seat.service';
import { PartyListCardModel } from '../../api';

@Component({
    selector: 'app-party-container',
    standalone: true,
    imports: [CommonModule, PersonCardComponent],
    template: `
    <div class="party-container">
      <h2 class="party-name">{{ partyListCardModel.name }}</h2>
      <div class="cards-grid">
        <app-person-card 
          *ngFor="let person_card of partyListCardModel.candidateModels" 
          [candidateCardModel]="person_card"
          [showCounter]="showCounter"
        ></app-person-card>
      </div>
    </div>
  `,
    styles: [`
    .party-container {
      background-color: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .party-name {
      color: #2c3e50;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e9ecef;
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }
    
    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 15px;
      }
      
      .party-name {
        font-size: 20px;
      }
    }
  `]
})
export class PartyContainerComponent {
    @Input() partyListCardModel!: PartyListCardModel;
    @Input() showCounter!: boolean;

    constructor(private seatService: SeatService) { }


}
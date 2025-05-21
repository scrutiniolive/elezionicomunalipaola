export interface Party {
    id: number;
    name: string;
    cards: PersonCard[];
}

export interface PersonCard {
    id: number;
    imageUrl: string;
    counter: number;
    lastName: string;
    firstName: string;
    partyId: string;
    isMayor: boolean;
}
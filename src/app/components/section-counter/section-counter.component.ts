import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyListCardModel } from '../../api/model/partyListCardModel';
import { CardControllerService } from '../../api/api/cardController.service';
import { PartyContainerComponent } from '../party-container/party-container.component';
import { CandidateCardModel, DashboardControllerService, ElectionDisplayControllerService, SectionControllerService, SectionDto, VoteResponse } from '../../api';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';


interface SectionData {
    id: number;
    name: string;
    votes?: string;
    state?: string;
}

@Component({
    selector: 'app-section-counter',
    standalone: true,
    imports: [CommonModule, PartyContainerComponent, FormsModule],
    templateUrl: './section-counter.component.html',
    styleUrl: './section-counter.component.scss'
})
export class SectionCounterComponent {

    filteredParties$ = new BehaviorSubject<any[]>([]); // Observable per i partiti filtrati


    changePartyId() {
        if (!this.partyId) {
            // Se non c'è selezione, mostra tutti i partiti
            this.filteredParties$.next(this.parties);
        } else {
            // Filtra i partiti in base alla selezione
            const filtered = this.parties.filter(party => party.id === Number(this.partyId));
            this.filteredParties$.next(filtered);
        }
    }






    loading = false;
    error = '';


    showCounter = true
    sectionName = ''
    sectionId = -1;
    ballotOpen = false;
    sections: SectionData[] = [];
    selectedSection: number = -1;
    partyId = 1;

    partiesMayors: PartyListCardModel[] = [];
    parties: PartyListCardModel[] = [];
    nullBlankVotes: PartyListCardModel[] = []

    nullVotes = 0;
    blankVotes = 0;

    isAdminAuthenticated = false;
    private authSubscription!: Subscription;


    constructor(
        private cardControllerService: CardControllerService, private sectionControllerService: SectionControllerService, private electionDisplayControllerService: ElectionDisplayControllerService, private authService: AuthService, private router: Router, private dashboardControllerService: DashboardControllerService
    ) { }

    ngOnInit(): void {
        this.loadSections();
        this.authSubscription = this.authService.isAdminAuthenticated$.subscribe(
            isAdmin => {
                this.isAdminAuthenticated = isAdmin;
            }
        );
    }

    private loadSections(): void {
        this.electionDisplayControllerService.allSectionInfo().subscribe({
            next: (data: SectionDto[]) => {
                this.sections = this.mapSectionDtoToSectionData(data);
                if (this.sections.length > 0) {
                    this.sections.sort((a, b) => {
                        const idA = a.id ?? 0;
                        const idB = b.id ?? 0;
                        return idA - idB;;
                    });
                    this.sectionId = Number(localStorage.getItem('sectionId'));
                    this.loadSeatInfo();
                }
            },
            error: (err) => console.error('Errore nel caricamento delle sezioni:', err)
        });
    }



    private mapSectionDtoToSectionData(dto: SectionDto[]): SectionData[] {
        return dto.map(section => ({
            id: section.id || 0,
            name: section.name || '',
            state: section.ballotOpen ? 'Aperto' : 'Chiuso',
            votes: '-'
        }));
    }


    changeSection() {
        this.authService.switchSection(this.sectionId)
            .subscribe({
                next: () => {
                    this.loadSeatInfo()
                },
                error: error => {
                    this.error = error.error?.message || 'Username o password non validi';
                    this.loading = false;
                }
            });
    }



    loadSeatInfo() {
        this.electionDisplayControllerService.sectionBaseInfo().subscribe({
            next: (data) => {
                this.sectionId = data.id ?? -1;
                this.sectionName = 'Seggio: ' + (data.name ?? '');
                this.ballotOpen = data.ballotOpen ?? false;
                this.loadData();
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


    loadData() {
        this.loadParties();
        this.loadNullBlankVotes();
    }

    loadNullBlankVotes() {
        this.dashboardControllerService.globalSectionStats(this.sectionId).subscribe(
            (voteResponse: VoteResponse) => {
                this.blankVotes = voteResponse.blanks ?? 0;
                this.nullVotes = voteResponse.nulls ?? 0;
                this.nullBlankVotes = this.createAndAddNullBlankPartyCardModel();

            }
        );
    }

    loadParties(): void {
        this.loading = true;
        this.error = '';

        this.cardControllerService.getSectionPartyListCards()
            .subscribe({
                next: (data) => {
                    this.parties = data
                    this.loading = false;

                    this.partiesMayors = this.createMayorParties()
                    const filtered = this.parties.filter(party => party.id === Number(this.partyId));
                    this.filteredParties$.next(filtered);
                },
                error: (err) => {
                    this.error = 'Errore nel caricamento dei dati: ' + (err.error?.message || err.message);
                    this.loading = false;
                }
            });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/seats/login']);
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

    /**
 * Crea un nuovo PartyListCardModel con dati di esempio e lo aggiunge all'array specificato
 * @param partiesArray L'array in cui inserire il nuovo partito
 * @returns Il PartyListCardModel appena creato
 */
    createAndAddNullBlankPartyCardModel(): PartyListCardModel[] {

        let partiesArray: PartyListCardModel[] = [];
        const candidates: CandidateCardModel[] = [
            {
                id: -1,
                firstName: 'Schede Bianche',
                counter: this.nullVotes,
                mayor: false
            },
            {
                id: -2,
                firstName: 'Schede Nulle',
                counter: this.blankVotes,
                mayor: false
            }
        ];

        // Crea il partito
        const newParty: PartyListCardModel = {
            id: partiesArray.length + 1,
            name: 'Scheda Nulla o Bianca',
            imageUrl: 'assets/images/party-logo.png',
            candidateModels: candidates
        };

        // Aggiunge il nuovo partito all'array
        partiesArray.push(newParty);

        // Restituisce il nuovo partito creato
        return partiesArray;
    }

    createMayorParties(): PartyListCardModel[] {

        let partiesArray: PartyListCardModel[] = [];
        const mayorCandidates = this.parties
            .flatMap(party => party.candidateModels || [])
            .filter(candidate => candidate.mayor);


        const newParty: PartyListCardModel = {
            id: -3,
            name: 'Candidati a Sindaco',
            imageUrl: 'assets/images/party-logo.png',
            candidateModels: mayorCandidates
        };

        // Aggiunge il nuovo partito all'array
        partiesArray.push(newParty);

        // Restituisce il nuovo partito creato
        return partiesArray;
    }


}

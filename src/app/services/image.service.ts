import { BehaviorSubject, Observable } from "rxjs";
import { ElectionDisplayControllerService } from "../api";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private images: Map<number, string> = new Map();
    private imagesLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(private electionDisplayControllerService: ElectionDisplayControllerService) {
        this.loadImages(); // Carica le immagini appena il service viene creato
    }

    private loadImages() {

        this.electionDisplayControllerService.candidateImages().subscribe({
            next: (data) => {
                this.images = new Map(Object.entries(data).map(([k, v]) => [Number(k), v]));
                this.imagesLoaded$.next(true);
            },
            error: (error) => {
                console.error('Errore nel caricamento delle immagini:', error);
                this.imagesLoaded$.next(false);
            }
        });
    }

    // Metodo per ottenere un'immagine specifica
    getImage(id: number): string | undefined {
        return this.images.get(id);
    }

    // Metodo per verificare se le immagini sono state caricate
    isLoaded(): Observable<boolean> {
        return this.imagesLoaded$.asObservable();
    }

    // Metodo per ottenere tutte le immagini
    getAllImages(): Map<number, string> {
        return this.images;
    }
}
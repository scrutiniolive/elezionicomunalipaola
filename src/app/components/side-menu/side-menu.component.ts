import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
    selector: 'app-side-menu',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
<div class="side-menu">
    <div class="logo">
        <img src="images/paola.png" alt="logo" class="icon">
        <h3>Elezioni Comunali Paola</h3>
    </div>
     <nav class="menu">
        <ul class="main-menu">
            <li><a routerLink="/dashboard" routerLinkActive="active">Exit Pool</a></li>
            <li><a routerLink="/seat-results" routerLinkActive="active">Risultati Seggio</a></li>
            <li><a routerLink="/candidate-results" routerLinkActive="active">Consiglio Comunale Eletto</a></li>
            <li><a routerLink="/candidates" routerLinkActive="active">Liste e Candidati</a></li>
        </ul>
        <ul class="bottom-menu">
            <li><a routerLink="/seats" routerLinkActive="active">Login</a></li>
        </ul>
    </nav>
    <div class="footer">
        <p class="credits">Realizzato da<br>Luca Pastore, Paolo Sciammarella e Armando Santoro</p>
        <p class="copyright">© 2025 Elezioni Comunali Paola - ScrutinioLive<br>Tutti i diritti riservati</p>
        <p class="legal">Protetto da: L. 633/1941<br>D.Lgs. 30/2005</p>
        <p class="disclaimer">I dati mostrati sono da ritenersi indicativi e potrebbero differire da quelli ufficiali. 
          Il codice sorgente e il concept di questa applicazione sono protetti 
dalle leggi sul copyright e sulla proprietà intellettuale (L. 633/1941, D.Lgs. 30/2005).</p>
    </div>
</div>
  `,
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent { }
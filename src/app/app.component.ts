import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MaintenanceBannerComponent } from './components/banner/banner.component';
import { MenuSideComponent } from './components/menu-side/menu-side.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MaintenanceBannerComponent, MenuSideComponent],
    template: `
    <div class="app-container" [class.menu-open]="isMenuOpen">
     
      
      <!-- Menu laterale -->
      <app-menu-side (menuToggled)="onMenuToggle($event)"></app-menu-side>
      
      <!-- Contenuto principale -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Overlay per dispositivi mobili -->
      <div class="overlay" [class.show]="isMenuOpen" (click)="closeMenu()"></div>
    </div>
     <app-maintenance-banner></app-maintenance-banner>
  `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Elezioni Comunali';
    isMenuOpen = false;

    onMenuToggle(isOpen: boolean) {
        this.isMenuOpen = isOpen;
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        // Emetti l'evento di toggle anche al componente menu-side se necessario
        const menuSide = document.querySelector('app-menu-side') as any;
        if (menuSide && menuSide.toggleMenu) {
            menuSide.toggleMenu();
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        // Emetti l'evento di chiusura anche al componente menu-side se necessario
        const menuSide = document.querySelector('app-menu-side') as any;
        if (menuSide && menuSide.closeMenu) {
            menuSide.closeMenu();
        }
    }
}
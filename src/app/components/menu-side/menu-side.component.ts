import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-menu-side',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './menu-side.component.html',
    styleUrls: ['./menu-side.component.scss']
})
export class MenuSideComponent {
    isMenuOpen: boolean = false;
    @Output() menuToggled = new EventEmitter<boolean>();

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.menuToggled.emit(this.isMenuOpen);
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.menuToggled.emit(false);
    }
}

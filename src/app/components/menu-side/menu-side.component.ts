import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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
    isAuthenticated$: Observable<boolean>;



    constructor(private authService: AuthService) {
        this.isAuthenticated$ = this.authService.isAuthenticated$;
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.menuToggled.emit(this.isMenuOpen);
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.menuToggled.emit(false);
    }




}

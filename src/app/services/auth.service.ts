// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthenticationControllerService } from '../api/api/authenticationController.service';
import { CredentialsDto } from '../api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private isAdminAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAdminAuthenticated$ = this.isAdminAuthenticatedSubject.asObservable();

    constructor(private authControllerService: AuthenticationControllerService) {
        // Verifica se esiste già un token al caricamento del servizio
        this.isAuthenticatedSubject.next(this.hasToken());
        this.isAdminAuthenticatedSubject.next(this.isAdmin());
    }

    login(username: string, password: string): Observable<any> {
        const authRequest: CredentialsDto = {
            username: username,
            password: password
        };

        return this.authControllerService.login(authRequest)
            .pipe(
                tap(response => {
                    if (response && response.token) {
                        // Salva il token nel localStorage
                        localStorage.setItem('auth_token', response.token);
                        localStorage.setItem('userSectionId', response.section ? response.section.toString() : '')
                        localStorage.setItem('isAdmin', response.isAdmin ? 'true' : 'false')
                        // Aggiorna lo stato di autenticazione
                        this.isAuthenticatedSubject.next(true);
                        this.isAdminAuthenticatedSubject.next(true);
                    }
                })
            );
    }

    switchSection(sectionId: number): Observable<any> {
        return this.authControllerService.changeSection(sectionId)
            .pipe(
                tap(response => {
                    if (response && response.token) {
                        // Salva il token nel localStorage
                        localStorage.setItem('auth_token', response.token);
                        localStorage.setItem('userSectionId', response.section ? response.section.toString() : '')
                        localStorage.setItem('isAdmin', response.isAdmin ? 'true' : 'false')
                        // Aggiorna lo stato di autenticazione
                        this.isAuthenticatedSubject.next(true);
                        this.isAdminAuthenticatedSubject.next(true);
                    }
                })
            );
    }

    logout(): void {
        // Rimuovi il token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userSectionId');
        localStorage.removeItem('isAdmin');
        // Aggiorna lo stato di autenticazione
        this.isAuthenticatedSubject.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    hasToken(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return localStorage.getItem('isAdmin') ? Boolean(localStorage.getItem('isAdmin')) : false
    }


    isAuthenticated(): boolean {
        return this.hasToken();
    }
}
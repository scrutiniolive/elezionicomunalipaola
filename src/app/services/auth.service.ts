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

    constructor(private authControllerService: AuthenticationControllerService) {
        // Verifica se esiste già un token al caricamento del servizio
        this.isAuthenticatedSubject.next(this.hasToken());
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
                        // Aggiorna lo stato di autenticazione
                        this.isAuthenticatedSubject.next(true);
                    }
                })
            );
    }

    logout(): void {
        // Rimuovi il token
        localStorage.removeItem('auth_token');
        // Aggiorna lo stato di autenticazione
        this.isAuthenticatedSubject.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    hasToken(): boolean {
        return !!this.getToken();
    }

    isAuthenticated(): boolean {
        return this.hasToken();
    }
}
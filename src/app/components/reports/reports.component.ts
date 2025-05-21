// reports.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthControllerService } from '../../api/api/authController.service';

interface Candidate {
    imageUrl: string;
    firstName: string;
    lastName: string;
    id: number;
}

interface Party {
    name: string;
    candidates: Candidate[];
    id: number;
}

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent {

    private fb = inject(FormBuilder);
    private authService = inject(AuthControllerService);

    loginForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    isAuthenticated = false;
    parties: Party[] = [];
    loginError = '';

    onSubmit() {
        if (this.loginForm.valid) {
            const authRequest = {
                username: this.loginForm.get('username')?.value,
                password: this.loginForm.get('password')?.value
            };

            this.authService.login(authRequest, 'body').subscribe({
                next: (response) => {
                    if (response?.token) {
                        localStorage.setItem('token', response.token);
                        this.isAuthenticated = true;
                        this.loginError = ''; // Pulisce eventuali errori precedenti
                        this.loadPartyData();
                    } else {
                        this.loginError = 'Token non valido. Autenticazione fallita.';
                        this.isAuthenticated = false;
                    }
                },
                error: (error) => {
                    console.error('Login failed:', error);
                    this.loginError = 'Errore durante il login. Riprova più tardi.';
                    this.isAuthenticated = false;
                }
            });
        }
    }

    loadPartyData() {
        // Implementa la chiamata al service per caricare i dati
    }
}
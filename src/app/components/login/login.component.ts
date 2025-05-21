// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    returnUrl: string = '/seats';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // Ottieni l'URL di ritorno dai parametri se esiste
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params['returnUrl'] || '/seats';
        });
    }

    // Getter per un accesso più facile ai campi del form
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // Stop qui se il form è invalido
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.error = '';

        this.authService.login(
            this.f['username'].value,
            this.f['password'].value
        )
            .subscribe({
                next: () => {
                    // Reindirizza all'URL richiesto o alla pagina principale dei report
                    this.router.navigateByUrl(this.returnUrl);
                },
                error: error => {
                    this.error = error.error?.message || 'Username o password non validi';
                    this.loading = false;
                }
            });
    }
}
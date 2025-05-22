// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { SectionCounterComponent } from './components/section-counter/section-counter.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    {
        path: 'seats',
        children: [
            {
                path: '',
                component: SectionCounterComponent,
                canActivate: [authGuard]
            },
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    },
    { path: 'candidates', loadComponent: () => import('./components/candidate/candidate.component').then(m => m.CandidateComponent) },
    { path: 'seat-results', loadComponent: () => import('./components/seat-results/seat-results.component').then(m => m.SeatResultsComponent) },
    { path: 'candidate-results', loadComponent: () => import('./components/candidate-results/candidate-results.component').then(m => m.CandidateResultsComponent) },
    { path: '**', redirectTo: '/dashboard' }
];
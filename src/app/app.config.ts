import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { environment } from '../environments/environment';
import { Configuration, ApiModule } from './api'; // importa entrambi

// Crea la configuration
const apiConfiguration = new Configuration({
    basePath: environment.apiBasePath
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        // Importa i providers dall'ApiModule
        importProvidersFrom(
            ApiModule.forRoot(() => apiConfiguration)
        ),
        // Opzionale: fornisci anche la Configuration direttamente se serve
        { provide: Configuration, useValue: apiConfiguration }
    ]
};
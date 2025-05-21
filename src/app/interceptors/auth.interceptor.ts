import { HttpInterceptorFn, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, of, catchError } from 'rxjs';

// Variabile per memorizzare l'IP dopo averlo recuperato la prima volta
let cachedIP: string | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const http = inject(HttpClient);

    // Evita loop infiniti: non intercettare la richiesta per ottenere l'IP
    if (req.url.includes('api.ipify.org') || req.url.includes('ipapi.co')) {
        return next(req);
    }

    let enhancedReq = req.clone(); // Clona la richiesta *inizialmente*

    // Funzione per aggiungere l'header 'ip-statistics'
    const addIpHeader = (request: any, ip: string | null): any => {
        return request.clone({
            headers: request.headers.set('ip-statistics', ip || 'unknown')
        });
    };

    // Aggiungi l'header 'ip-statistics' (con valore in cache o 'unknown' se non disponibile)
    if (cachedIP) {
        enhancedReq = addIpHeader(enhancedReq, cachedIP);
    }

    // Gestisci il token (solo se il path *non* contiene /pub)
    if (!req.url.includes('/pub')) {
        const token = localStorage.getItem('auth_token');
        if (token) {
            enhancedReq = enhancedReq.clone({
                headers: enhancedReq.headers.set('Authorization', `Bearer ${token}`)
            });
        }
    }

    // Se abbiamo già l'IP in cache, invia la richiesta
    if (cachedIP) {
        return next(enhancedReq);
    }

    // Altrimenti, ottieni l'IP e poi procedi con la richiesta originale
    return http.get('https://api.ipify.org?format=json').pipe(
        switchMap((response: any) => {
            cachedIP = response.ip;
            enhancedReq = addIpHeader(enhancedReq, cachedIP); // Aggiungi l'IP dopo averlo recuperato
            return next(enhancedReq);
        }),
        catchError(() => {
            // In caso di errore, procedi con la richiesta con 'unknown' come IP
            enhancedReq = addIpHeader(enhancedReq, null); // Assicurati che ip-statistics sia presente, anche in caso di errore
            return next(enhancedReq);
        })
    );
};
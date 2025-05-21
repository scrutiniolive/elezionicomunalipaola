import { HttpInterceptorFn, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, of, catchError } from 'rxjs';

// Variabile per memorizzare l'IP dopo averlo recuperato la prima volta
let cachedIP: string | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const http = inject(HttpClient);

    // Usa un early return per le chiamate pubbliche
    if (req.url.includes('/pub')) return next(req);

    // Evita loop infiniti: non intercettare la richiesta per ottenere l'IP
    if (req.url.includes('api.ipify.org') || req.url.includes('ipapi.co')) {
        return next(req);
    }

    const token = localStorage.getItem('auth_token');
    let enhancedReq = token
        ? req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
        : req;

    // Se abbiamo già l'IP in cache, usalo direttamente
    if (cachedIP) {
        enhancedReq = enhancedReq.clone({
            headers: enhancedReq.headers.set('ip-statistics', cachedIP)
        });
        return next(enhancedReq);
    }

    // Altrimenti, ottieni l'IP e poi procedi con la richiesta originale
    return http.get('https://api.ipify.org?format=json').pipe(
        switchMap((response: any) => {
            cachedIP = response.ip;

            // Clona la richiesta con l'header IP aggiunto
            enhancedReq = enhancedReq.clone({
                headers: enhancedReq.headers.set('ip-statistics', cachedIP || 'unknown')
            });

            return next(enhancedReq);
        }),
        catchError(() => {
            // In caso di errore, procedi con la richiesta senza l'header IP
            return next(enhancedReq);
        })
    );
};
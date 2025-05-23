/**
 * OpenAPI definition
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { CredentialsDto } from '../model/credentialsDto';
// @ts-ignore
import { SignUpDto } from '../model/signUpDto';
// @ts-ignore
import { UserDto } from '../model/userDto';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import { BaseService } from '../api.base.service';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationControllerService extends BaseService {

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string|string[], @Optional() configuration?: Configuration) {
        super(basePath, configuration);
    }

    /**
     * Switch the section id 
     * Set a new section id and provide a new token
     * @param sectionId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public changeSection(sectionId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<UserDto>;
    public changeSection(sectionId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<UserDto>>;
    public changeSection(sectionId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<UserDto>>;
    public changeSection(sectionId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (sectionId === null || sectionId === undefined) {
            throw new Error('Required parameter sectionId was null or undefined when calling changeSection.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
          <any>sectionId, 'sectionId');

        let localVarHeaders = this.defaultHeaders;

        // authentication (Bearer Authentication) required
        localVarHeaders = this.configuration.addCredentialToHeaders('Bearer Authentication', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json',
            '*/*'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/section/switch`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<UserDto>('put', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * User login
     * The login user operation
     * @param credentialsDto 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public login(credentialsDto: CredentialsDto, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<UserDto>;
    public login(credentialsDto: CredentialsDto, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<UserDto>>;
    public login(credentialsDto: CredentialsDto, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<UserDto>>;
    public login(credentialsDto: CredentialsDto, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (credentialsDto === null || credentialsDto === undefined) {
            throw new Error('Required parameter credentialsDto was null or undefined when calling login.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (Bearer Authentication) required
        localVarHeaders = this.configuration.addCredentialToHeaders('Bearer Authentication', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json',
            '*/*'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/pub/login`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<UserDto>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: credentialsDto,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * User Registration
     * Register an user
     * @param signUpDto 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public register(signUpDto: SignUpDto, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<UserDto>;
    public register(signUpDto: SignUpDto, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<UserDto>>;
    public register(signUpDto: SignUpDto, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<UserDto>>;
    public register(signUpDto: SignUpDto, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (signUpDto === null || signUpDto === undefined) {
            throw new Error('Required parameter signUpDto was null or undefined when calling register.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (Bearer Authentication) required
        localVarHeaders = this.configuration.addCredentialToHeaders('Bearer Authentication', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json',
            '*/*'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/register`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<UserDto>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: signUpDto,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

}

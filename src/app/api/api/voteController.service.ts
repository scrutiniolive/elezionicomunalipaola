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
import { VoteRequest } from '../model/voteRequest';
// @ts-ignore
import { VoteResponse } from '../model/voteResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import { BaseService } from '../api.base.service';



@Injectable({
  providedIn: 'root'
})
export class VoteControllerService extends BaseService {

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string|string[], @Optional() configuration?: Configuration) {
        super(basePath, configuration);
    }

    /**
     * Downloads an excel withe the votes
     * Gives back and execel file with the vote results for each candidate
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public exportToExcel(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/vnd.ms-excel' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public exportToExcel(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/vnd.ms-excel' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public exportToExcel(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/vnd.ms-excel' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public exportToExcel(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/vnd.ms-excel' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any> {

        let localVarHeaders = this.defaultHeaders;

        // authentication (Bearer Authentication) required
        localVarHeaders = this.configuration.addCredentialToHeaders('Bearer Authentication', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/vnd.ms-excel',
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

        let localVarPath = `/votes/download`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('put', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
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
     * Single section Exit Pool
     * Total votes grouped by null, blank, parties, councillor
     * @param sectionId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public globalSectionStats(sectionId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<VoteResponse>;
    public globalSectionStats(sectionId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<VoteResponse>>;
    public globalSectionStats(sectionId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<VoteResponse>>;
    public globalSectionStats(sectionId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (sectionId === null || sectionId === undefined) {
            throw new Error('Required parameter sectionId was null or undefined when calling globalSectionStats.');
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

        let localVarPath = `/votes/stats/${this.configuration.encodeParam({name: "sectionId", value: sectionId, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int64"})}`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<VoteResponse>('get', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
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
     * Multiple votes inserted
     * Multiple insert
     * @param voteRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public insertMultipleVote(voteRequest: VoteRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<VoteResponse>;
    public insertMultipleVote(voteRequest: VoteRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<VoteResponse>>;
    public insertMultipleVote(voteRequest: VoteRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<VoteResponse>>;
    public insertMultipleVote(voteRequest: VoteRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (voteRequest === null || voteRequest === undefined) {
            throw new Error('Required parameter voteRequest was null or undefined when calling insertMultipleVote.');
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

        let localVarPath = `/votes/multiple`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<VoteResponse>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: voteRequest,
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
     * Single vote inserted
     * Single insert
     * @param voteRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public insertSingleVote(voteRequest: VoteRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<VoteResponse>;
    public insertSingleVote(voteRequest: VoteRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<VoteResponse>>;
    public insertSingleVote(voteRequest: VoteRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<VoteResponse>>;
    public insertSingleVote(voteRequest: VoteRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | '*/*', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (voteRequest === null || voteRequest === undefined) {
            throw new Error('Required parameter voteRequest was null or undefined when calling insertSingleVote.');
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

        let localVarPath = `/votes`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<VoteResponse>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: voteRequest,
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

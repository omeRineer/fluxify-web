import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, finalize, firstValueFrom, Observable, throwError } from "rxjs";
import { HttpOptions } from "../../models/common/http-options";
import { environment } from "../../../../environments/environment.development";



export abstract class BaseHttpService {

    protected http = inject(HttpClient);

    constructor(protected endpoint: string) { }

    protected get fullUrl(): string {
        return `${environment.webApiUrl}/${this.endpoint}`;
    }

    protected get<T>(urlSuffix = '', options?: HttpOptions): Observable<T> {
        return this.http.get<T>(`${this.fullUrl}${urlSuffix}`, options).pipe(
            catchError(this.handleError)
        );
    }

    protected post<T>(urlSuffix = '', body: any, options?: HttpOptions): Observable<T> {
        return this.http.post<T>(`${this.fullUrl}${urlSuffix}`, body, options).pipe(
            catchError(this.handleError)
        );
    }

    protected put<T>(urlSuffix = '', body: any, options?: HttpOptions): Observable<T> {
        return this.http.put<T>(`${this.fullUrl}${urlSuffix}`, body, options).pipe(
            catchError(this.handleError)
        );
    }

    protected delete<T>(urlSuffix = '', options?: HttpOptions): Observable<T> {
        return this.http.delete<T>(`${this.fullUrl}${urlSuffix}`, options).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Bilinmeyen bir hata oluştu.';

        if (error.error instanceof ErrorEvent) {
            // İstemci tarafında (Client-side) veya network kaynaklı bir hata
            errorMessage = `Hata: ${error.error.message}`;
        } else {
            // Sunucu tarafında (Server-side) oluşan hata kodları (400, 401, 404, 500 vb.)
            errorMessage = error.error?.message || `Sunucu Hatası: ${error.status} - ${error.statusText}`;
        }

        console.error(`[Fluxify HTTP Error] [/${error.url?.split('/').pop()}]:`, errorMessage);

        // Uygulamanın geri kalanına hatayı fırlat
        return throwError(() => new Error(errorMessage));
    }
}
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, timer, of } from 'rxjs';
import { catchError, filter, take, switchMap, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { UserTokenDto } from '../models/user-token.dto';
import { Intervals } from '../shared/constants';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    private isRefreshingToken = false;

    private tokenRefreshSubject = new BehaviorSubject<string | null>(null);

    private readonly REFRESH_THRESHOLD = Intervals.OneMinute;

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {
        this.setupTokenRefreshTimer();
    }

    /**
     * Sets up periodic token check to refresh before expiration
     */
    private setupTokenRefreshTimer(): void {
        timer(0, Intervals.OneMinute).subscribe(() => {
            if (!this.authService.isSignedIn) {
                return;
            }

            const currentTime = Date.now();
            const timeUntilExpiry = this.authService.tokenExpiresIn! - currentTime;

            if (
                timeUntilExpiry > 0 &&
                timeUntilExpiry < this.REFRESH_THRESHOLD &&
                !this.isRefreshingToken
            ) {
                const refreshToken = this.authService.refreshToken;
                if (refreshToken) {
                    this.refreshTokenSilently(refreshToken);
                }
            }
        });
    }

    /**
     * Refreshes the token silently without waiting for 401 errors
     */
    private refreshTokenSilently(refreshToken: string): void {
        this.isRefreshingToken = true;

        this.usersService
            .refreshToken(refreshToken)
            .pipe(
                tap((token: UserTokenDto) => {
                    this.authService.processLogin(token);
                    this.tokenRefreshSubject.next(token.access_token);
                }),
                catchError((error) => {
                    console.error('Silent token refresh failed:', error);
                    return of(null as unknown as UserTokenDto);
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                }),
            )
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Skip token for refresh token requests
        if (this.isRefreshTokenRequest(request)) {
            return next.handle(request);
        }

        // Add auth token if available
        if (this.authService.authToken) {
            request = this.addTokenToRequest(request, this.authService.authToken);
        }

        // Process the request
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Handle 401 unauthorized errors
                if (error.status === 401) {
                    return this.handle401Error(request, next);
                }

                // Propagate other errors
                return throwError(() => error);
            }),
        );
    }

    /**
     * Adds the authentication token to the request headers
     */
    private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    /**
     * Checks if this request is for token refresh
     */
    private isRefreshTokenRequest(request: HttpRequest<any>): boolean {
        return request.url.includes('auth/refresh-token');
    }

    /**
     * Handles 401 unauthorized errors by attempting to refresh the token
     */
    private handle401Error(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        if (!this.authService.refreshToken) {
            this.authService.logout();
            return throwError(() => new Error('Authentication required'));
        }

        if (this.isRefreshingToken) {
            return this.queueRequestBehindRefresh(request, next);
        }

        return this.performTokenRefresh(this.authService.refreshToken, request, next);
    }

    /**
     * Performs the token refresh operation
     */
    private performTokenRefresh(
        refreshToken: string,
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        this.isRefreshingToken = true;
        this.tokenRefreshSubject.next(null);

        return this.usersService.refreshToken(refreshToken).pipe(
            switchMap((token: UserTokenDto) => {
                this.authService.processLogin(token);
                this.tokenRefreshSubject.next(token.access_token);
                return next.handle(this.addTokenToRequest(request, token.access_token!));
            }),
            catchError(() => {
                this.authService.logout();
                this.tokenRefreshSubject.next(null);
                return throwError(() => new Error('Token refresh failed'));
            }),
            finalize(() => {
                this.isRefreshingToken = false;
            }),
        );
    }

    /**
     * Queues a request behind an ongoing token refresh
     */
    private queueRequestBehindRefresh(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return this.tokenRefreshSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
                return next.handle(this.addTokenToRequest(request, token));
            }),
        );
    }
}

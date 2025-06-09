import { Injectable, Optional, SkipSelf } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { UserTokenDto } from '../models/user-token.dto';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UsersService extends HttpService {
    constructor(
        http: HttpClient,
        @Optional() @SkipSelf() parentModule: UsersService,
        authService: AuthService,
    ) {
        super(http, parentModule, authService);
    }

    login(userName: string, password: string): Observable<UserTokenDto> {
        const body = new URLSearchParams();
        body.set('username', userName);
        body.set('password', password);
        body.set('grant_type', 'password');
        body.set('client_id', environment.client_id);
        body.set('client_secret', environment.client_secret);

        return this.post<UserTokenDto>('auth/token', body, undefined, false).pipe(
            tap((token) => this.authService.processLogin(userName, token)),
        );
    }

    changePassword(newPassword: string): Observable<UserTokenDto> {
        const passwordModel = {
            newPassword: newPassword,
        };
        return this.post<UserTokenDto>('auth/change-password', passwordModel);
    }

    refreshToken(token: string): Observable<UserTokenDto> {
        const actionUrl = `auth/refresh-token?token=${token}`;
        return this.post<UserTokenDto>(actionUrl, null);
    }
}

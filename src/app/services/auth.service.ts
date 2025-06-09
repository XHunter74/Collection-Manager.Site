import { Injectable } from '@angular/core';
import { Constants, Intervals } from '../shared/constants';
import { UserTokenDto } from '../models/user-token.dto';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isSignedInSubject = new Subject<boolean>();
    private authTokenInt: string | null = null;
    private refreshTokenInt: string | null = null;
    private tokenExpiresInt: number | null = null;

    constructor() {}

    isLoggedIn() {}

    userData() {}

    token(): string | null {
        const token = localStorage.getItem(Constants.AuthToken);
        if (token) {
            const expiresIn = localStorage.getItem(Constants.TokenExpiresIn);
            if (expiresIn && Number.parseInt(expiresIn, 10) > new Date().getTime()) {
                return token;
            }
        }
        return null;
    }

    checkAuth() {}

    public processLogin(userToken: UserTokenDto) {
        console.log('Processing login for user, token:', JSON.stringify(userToken));
        this.authToken = userToken.access_token;
        this.refreshToken = userToken.refresh_token;
        const expiresIn = new Date().getTime() + userToken.expires_in * Intervals.OneSecond;
        this.tokenExpiresIn = expiresIn;
    }

    logout() {
        this.authToken = null;
        this.refreshToken = null;
        this.tokenExpiresIn = null;
    }

    public get authToken(): string | null {
        if (!this.authTokenInt) {
            this.authTokenInt = localStorage.getItem(Constants.AuthToken);
        }
        return this.authTokenInt;
    }

    private set authToken(token: string | null) {
        this.authTokenInt = token;
        if (token) {
            localStorage.setItem(Constants.AuthToken, token);
        } else {
            localStorage.removeItem(Constants.AuthToken);
        }
    }

    public get refreshToken(): string | null {
        if (!this.refreshTokenInt) {
            this.refreshTokenInt = localStorage.getItem(Constants.RefreshToken);
        }
        return this.refreshTokenInt;
    }

    private set refreshToken(token: string | null) {
        this.refreshTokenInt = token;
        if (token) {
            localStorage.setItem(Constants.RefreshToken, token);
        } else {
            localStorage.removeItem(Constants.RefreshToken);
        }
    }

    public get tokenExpiresIn(): number | null {
        if (!this.tokenExpiresInt) {
            const expiresInStr = localStorage.getItem(Constants.TokenExpiresIn);
            this.tokenExpiresInt = expiresInStr !== null ? Number.parseInt(expiresInStr, 10) : null;
        }
        return this.tokenExpiresInt;
    }

    public set tokenExpiresIn(expiresIn: number | null) {
        this.tokenExpiresInt = expiresIn;
        if (expiresIn) {
            localStorage.setItem(Constants.TokenExpiresIn, expiresIn.toString());
        } else {
            localStorage.removeItem(Constants.TokenExpiresIn);
        }
    }

    public get isSignedIn(): boolean {
        const loggedIn = this.authToken ? true : false;
        return loggedIn;
    }
}

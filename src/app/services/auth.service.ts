import { Injectable } from '@angular/core';
import { Constants } from '../shared/constants';
import { UserTokenDto } from '../models/user-token.dto';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    isLoggedIn() {}

    userData() {}

    token(): string | null {
        const token = localStorage.getItem(Constants.Token);
        if (token) {
            const expiresIn = localStorage.getItem(Constants.TokenExpiresIn);
            if (expiresIn && Number.parseInt(expiresIn, 10) > new Date().getTime()) {
                return token;
            }
        }
        return null;
    }

    checkAuth() {}

    public processLogin(userName: string, userToken: UserTokenDto) {
        console.log('Processing login for user, token:', JSON.stringify(userToken));
        localStorage.setItem('user_name', userName);
        localStorage.setItem(Constants.Token, userToken.access_token);
        localStorage.setItem(Constants.RefreshToken, userToken.refresh_token);
    }

    logout() {
        localStorage.removeItem(Constants.Token);
        localStorage.removeItem(Constants.RefreshToken);
        localStorage.removeItem(Constants.TokenExpiresIn);
    }
}

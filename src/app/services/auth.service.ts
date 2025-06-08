import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private oidcSecurityService: OidcSecurityService,
    ) { }

    isLoggedIn() {
        return this.oidcSecurityService.isAuthenticated$;
    }

    userData() {
        return this.oidcSecurityService.userData$;
    }

    token() {
        return this.oidcSecurityService.getAccessToken();
    }

    checkAuth() {
        return this.oidcSecurityService.checkAuthMultiple();
    }

    login() {
        this.oidcSecurityService.authorize();
    }

    async logout() {
        await lastValueFrom(this.oidcSecurityService.logoff());
    }
}

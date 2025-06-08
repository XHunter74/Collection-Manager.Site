import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    isLoggedIn() {}

    userData() {}

    token() {}

    checkAuth() {}

    login(userName: string, password: string): Promise<boolean> {
        const url = `${environment.authUrl}token`;
        const body = new HttpParams()
            .set('grant_type', 'password')
            .set('username', userName)
            .set('password', password)
            .set('client_id', environment.client_id)
            .set('client_secret', environment.client_secret);
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return lastValueFrom(this.httpClient.post<any>(url, body.toString(), { headers }))
            .then((response) => {
                if (response && (response.access_token || response.token)) {
                    const token = response.access_token || response.token;
                    localStorage.setItem('token', token);
                    return true;
                }
                return false;
            })
            .catch(() => {
                return false;
            });
    }

    async logout() {}
}

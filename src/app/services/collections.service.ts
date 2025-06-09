import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { CollectionDto } from '../models/collection.dto';

@Injectable({
    providedIn: 'root',
})
export class CollectionsService extends HttpService {
    constructor(
        http: HttpClient,
        @Optional() @SkipSelf() parentModule: CollectionsService,
        authService: AuthService,
    ) {
        super(http, parentModule, authService);
    }

    loadCollections(): Observable<CollectionDto[]> {
        const actionUrl = 'collections';
        return this.get<CollectionDto[]>(actionUrl);
    }
}

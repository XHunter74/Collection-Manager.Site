import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { CollectionDto } from '../models/collection.dto';
import { CollectionFieldDto } from '../models/collection-field.dto';
import { BaseItemModel } from '../models/base-item.model';

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

    loadCollectionFields(collectionId: string): Observable<CollectionFieldDto[]> {
        const actionUrl = `collections/${collectionId}/collectionfields`;
        return this.get<CollectionFieldDto[]>(actionUrl);
    }

    loadCollectionItems(collectionId: string): Observable<BaseItemModel[]> {
        const actionUrl = `collections/${collectionId}/items`;
        return this.get<any[]>(actionUrl);
    }

    createCollection(collection: CollectionDto): Observable<CollectionDto> {
        const actionUrl = 'collections';
        return this.post<CollectionDto>(actionUrl, collection, undefined, false);
    }

    updateCollection(collection: CollectionDto): Observable<CollectionDto> {
        const actionUrl = `collections/${collection.id}`;
        return this.put<CollectionDto>(actionUrl, collection);
    }
}

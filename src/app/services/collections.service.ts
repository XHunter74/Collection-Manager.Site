import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { CollectionDto } from '../models/collection.dto';
import { CollectionFieldDto } from '../models/collection-field.dto';
import { BaseItemModel } from '../models/base-item.model';
import { FieldTypeDto } from '../models/field-type.dto';

import { PossibleValueDto } from '../models/possible-value.dto';
import { ImageDto } from '../models/image.dto';

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

    uploadCollectionImage(collectionId: string, file: File): Observable<ImageDto> {
        const formData = new FormData();
        formData.append('file', file);
        const actionUrl = `collections/${collectionId}/images`;
        return this.post<ImageDto>(actionUrl, formData, undefined, false);
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
        return this.get<BaseItemModel[]>(actionUrl);
    }

    loadCollectionItemsWithNameField(collectionId: string): Observable<BaseItemModel[]> {
        const actionUrl = `collections/${collectionId}/items?fields=Name`;
        return this.get<BaseItemModel[]>(actionUrl);
    }

    createCollection(collection: CollectionDto): Observable<CollectionDto> {
        const actionUrl = 'collections';
        return this.post<CollectionDto>(actionUrl, collection, undefined, false);
    }

    updateCollection(collection: CollectionDto): Observable<CollectionDto> {
        const actionUrl = `collections/${collection.id}`;
        return this.put<CollectionDto>(actionUrl, collection);
    }

    deleteCollection(collectionId: string): Observable<void> {
        const actionUrl = `collections/${collectionId}`;
        return this.delete(actionUrl);
    }

    loadFieldTypes(): Observable<FieldTypeDto[]> {
        const actionUrl = 'collectionfields/types';
        return this.get<FieldTypeDto[]>(actionUrl);
    }

    changeCollectionFieldOrder(orderId: string, order: number): Observable<CollectionFieldDto> {
        const actionUrl = `collectionfields/${orderId}/order?order=${order}`;
        return this.put<CollectionFieldDto>(actionUrl, undefined, undefined, false);
    }

    updateCollectionField(collectionField: CollectionFieldDto): Observable<CollectionFieldDto> {
        const actionUrl = `collectionfields/${collectionField.id}`;
        return this.put<CollectionFieldDto>(actionUrl, collectionField);
    }

    createCollectionField(
        collectionId: string,
        collectionField: CollectionFieldDto,
    ): Observable<CollectionFieldDto> {
        const actionUrl = `collections/${collectionId}/collectionfields`;
        return this.post<CollectionFieldDto>(actionUrl, collectionField, undefined, false);
    }

    deleteCollectionField(fieldId: string): Observable<void> {
        const actionUrl = `collectionfields/${fieldId}`;
        return this.delete(actionUrl);
    }

    loadPossibleValues(fieldId: string): Observable<PossibleValueDto[]> {
        const actionUrl = `collectionfields/${fieldId}/possible-values`;
        return this.get<PossibleValueDto[]>(actionUrl);
    }

    createPossibleValue(fieldId: string, value: string): Observable<PossibleValueDto> {
        const actionUrl = `collectionfields/${fieldId}/possible-values?value=${encodeURIComponent(value)}`;
        return this.post<PossibleValueDto>(actionUrl, value, undefined, false);
    }

    updatePossibleValue(id: string, value: string): Observable<PossibleValueDto> {
        const actionUrl = `collectionfields/possible-values/${id}?value=${encodeURIComponent(value)}`;
        return this.put<PossibleValueDto>(actionUrl, value);
    }

    deletePossibleValue(id: string): Observable<void> {
        const actionUrl = `collectionfields/possible-values/${id}`;
        return this.delete(actionUrl);
    }

    loadItemData(itemId: string): Observable<BaseItemModel> {
        const actionUrl = `items/${itemId}`;
        return this.get<BaseItemModel>(actionUrl);
    }
}

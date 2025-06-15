import { Injectable, Optional, SkipSelf } from '@angular/core';
import { environment } from '../../environments/environment';
import { Constants } from '../shared/constants';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ImageDto } from '../models/image.dto';

@Injectable({
    providedIn: 'root',
})
export class ImagesService extends HttpService {
    constructor(
        http: HttpClient,
        @Optional() @SkipSelf() parentModule: ImagesService,
        authService: AuthService,
    ) {
        super(http, parentModule, authService);
    }

    extractImageIdFromUrl(url: string): string | null {
        // eslint-disable-next-line no-useless-escape
        const regex = /\/images\/([a-fA-F0-9\-]+)(?:\?|$)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    getImageUrl(collectionId: string, imageId: string): string | null {
        if (collectionId && imageId) {
            let imageUrl = `${environment.apiUrl}collections/${collectionId}/images/${imageId}`;
            if (environment.useTokenAuthorizationForImages) {
                imageUrl = imageUrl + `?token=${this.authService.token()}`;
            }
            return imageUrl;
        } else {
            return Constants.PlaceholderImage;
        }
    }

    uploadCollectionImage(collectionId: string, file: File): Observable<ImageDto> {
        const formData = new FormData();
        formData.append('file', file);
        const actionUrl = `collections/${collectionId}/images`;
        return this.post<ImageDto>(actionUrl, formData, undefined, false);
    }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Constants } from '../shared/constants';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor(private authService: AuthService) {}

    extractImageIdFromUrl(url: string): string | null {
        const regex = /\/images\/([a-fA-F0-9\-]+)(?:\?|$)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    getImageUrl(collectionId: string, imageId: string): string | null {
        if (imageId) {
            let imageUrl = `${environment.apiUrl}collections/${collectionId}/images/${imageId}`;
            if (environment.useTokenAuthorizationForImages) {
                imageUrl = imageUrl + `?token=${this.authService.token()}`;
            }
            return imageUrl;
        } else {
            return Constants.PlaceholderImage;
        }
    }
}

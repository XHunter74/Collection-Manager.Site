import { Component, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

@Component({
    selector: 'app-image-control',
    templateUrl: './image-control.component.html',
    styleUrl: './image-control.component.css',
    standalone: false,
})
export class ImageControlComponent {
    @Input() imageId: string | null = null;
    @Input() collectionId: string | null = null;

    constructor(private utilsService: UtilsService) {}

    onImageSelected(event: Event) {}

    getImageUrl(): string | null {
        return this.utilsService.getImageUrl(this.collectionId || '', this.imageId || '');
    }

    deleteImage(): void {
        this.imageId = null;
    }

    enlargeImage(): void {
        console.log('Enlarge image functionality not implemented yet.');
    }
}

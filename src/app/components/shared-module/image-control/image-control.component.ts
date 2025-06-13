import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImagesService } from '../../../services/images.service';
import { ImageDto } from '../../../models/image.dto';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageModalComponent } from '../view-image-modal/view-image-modal.component';

@Component({
    selector: 'app-image-control',
    templateUrl: './image-control.component.html',
    styleUrl: './image-control.component.css',
    standalone: false,
})
export class ImageControlComponent {
    @Input() imageId: string | null = null;
    @Output() imageIdChange = new EventEmitter<string | null>();
    @Input() collectionId: string | null = null;
    uploadingImage: boolean = false;

    constructor(
        private matDialog: MatDialog,
        private imagesService: ImagesService,
    ) {}

    uploadImage(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        this.uploadingImage = true;
        this.imagesService.uploadCollectionImage(this.collectionId || '', file).subscribe({
            next: (imageDto: ImageDto) => {
                this.imageId = imageDto.fileId;
                this.imageIdChange.emit(this.imageId);
                this.uploadingImage = false;
            },
            error: () => {
                this.uploadingImage = false;
            },
        });
    }

    getImageUrl(): string | null {
        return this.imagesService.getImageUrl(this.collectionId || '', this.imageId || '');
    }

    deleteImage(): void {
        this.imageId = null;
        this.imageIdChange.emit(this.imageId);
    }

    enlargeImage(): void {
        ViewImageModalComponent.show(this.matDialog, this.getImageUrl() ?? undefined);
    }
}

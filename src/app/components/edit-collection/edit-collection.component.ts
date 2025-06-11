import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CollectionsService } from '../../services/collections.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CollectionDto } from '../../models/collection.dto';
import { ImageDto } from '../../models/image.dto';
import { environment } from '../../../environments/environment';
import { Constants } from '../../shared/constants';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-edit-collection',
    templateUrl: './edit-collection.component.html',
    styleUrl: './edit-collection.component.css',
    standalone: false,
})
export class EditCollectionComponent implements OnInit {
    title: string = '';
    saveButtonText: string = '';
    collectionId: string = '';

    editForm = new UntypedFormGroup({
        collectionName: new UntypedFormControl('', [Validators.required]),
        description: new UntypedFormControl(''),
        image: new UntypedFormControl(''),
    });

    imageId: string | null = null;
    uploadingImage = false;

    constructor(
        private readonly dialogRef: MatDialogRef<EditCollectionComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: CollectionDto,
        private collectionsService: CollectionsService,
        private authService: AuthService,
    ) {}

    static show(
        dialog: MatDialog,
        width?: string,
        data?: CollectionDto,
    ): Observable<CollectionDto> {
        if (!width) {
            width = '430px';
        }
        const dialogRef = dialog.open(EditCollectionComponent, {
            width,
            height: '550px',
            disableClose: false,
            data: data,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit(): void {
        if (this.componentData) {
            this.collectionId = this.componentData.id!;
            this.title = 'EDIT_COLLECTION.TITLE_EDIT';
            this.saveButtonText = 'EDIT_COLLECTION.SAVE_EDIT';
            this.editForm.patchValue({
                collectionName: this.componentData.name,
                description: this.componentData.description,
                // image: this.componentData.image || '',
            });
            this.imageId = this.componentData.image || null;
        } else {
            this.title = 'EDIT_COLLECTION.TITLE_CREATE';
            this.saveButtonText = 'EDIT_COLLECTION.SAVE_CREATE';
        }
    }

    onImageSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        this.uploadingImage = true;
        this.collectionsService.uploadCollectionImage(this.collectionId, file).subscribe({
            next: (imageDto: ImageDto) => {
                this.imageId = imageDto.fileId;
                this.editForm.patchValue({ image: this.imageId });
                this.uploadingImage = false;
            },
            error: () => {
                this.uploadingImage = false;
                // Optionally show error
            },
        });
    }

    saveChanges() {
        const updatedCollection = new CollectionDto();
        updatedCollection.id = this.collectionId;
        updatedCollection.name = this.collectionName?.value;
        updatedCollection.description = this.description?.value;
        updatedCollection.image = this.imageId || undefined;
        this.dialogRef.close(updatedCollection);
    }

    get collectionName() {
        return this.editForm.get('collectionName');
    }

    get description() {
        return this.editForm.get('description');
    }

    public get getImageUrl(): string | null {
        if (this.imageId) {
            let imageUrl = `${environment.apiUrl}collections/${this.collectionId}/images/${this.imageId}`;
            imageUrl = imageUrl + `?token=${this.authService.token()}`;
            return imageUrl;
        } else {
            return Constants.PlaceholderImage;
        }
    }
}

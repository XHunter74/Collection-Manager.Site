import { Component, Inject, OnInit, Optional } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CollectionDto } from '../../../models/collection.dto';

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

    uploadingImage = false;

    constructor(
        private readonly dialogRef: MatDialogRef<EditCollectionComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: CollectionDto,
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
                image: this.componentData.image || '',
            });
        } else {
            this.title = 'EDIT_COLLECTION.TITLE_CREATE';
            this.saveButtonText = 'EDIT_COLLECTION.SAVE_CREATE';
        }
    }

    saveChanges() {
        const updatedCollection = new CollectionDto();
        updatedCollection.id = this.collectionId;
        updatedCollection.name = this.collectionName?.value;
        updatedCollection.description = this.description?.value;
        updatedCollection.image = this.image?.value;
        this.dialogRef.close(updatedCollection);
    }

    get collectionName() {
        return this.editForm.get('collectionName');
    }

    get description() {
        return this.editForm.get('description');
    }

    get image() {
        return this.editForm.get('image');
    }
}

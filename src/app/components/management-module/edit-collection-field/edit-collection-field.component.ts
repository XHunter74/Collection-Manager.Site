import { Component, Inject, OnInit, Optional } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CollectionFieldDto } from '../../../models/collection-field.dto';
import { Observable } from 'rxjs';
import { EditCollectionFieldModel } from '../../../models/edit-collection-field.model';
import { FieldTypes } from '../../../models/field-types.enum';

@Component({
    selector: 'app-edit-collection-field',
    templateUrl: './edit-collection-field.component.html',
    styleUrl: './edit-collection-field.component.css',
    standalone: false,
})
export class EditCollectionFieldComponent implements OnInit {
    title: string = '';
    saveButtonText: string = '';
    fieldId: string = '';
    fieldTypes = Object.keys(FieldTypes)
        .filter((key) => isNaN(Number(key)))
        .map((key) => ({
            value: FieldTypes[key as keyof typeof FieldTypes],
            name: key,
        }));

    editForm = new UntypedFormGroup({
        displayName: new UntypedFormControl('', [Validators.required]),
        fieldType: new UntypedFormControl(''),
    });

    constructor(
        private readonly dialogRef: MatDialogRef<EditCollectionFieldComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: EditCollectionFieldModel,
    ) {}

    static show(
        dialog: MatDialog,
        width?: string,
        data?: EditCollectionFieldModel,
    ): Observable<CollectionFieldDto> {
        if (!width) {
            width = '430px';
        }
        const dialogRef = dialog.open(EditCollectionFieldComponent, {
            width,
            height: '335px',
            disableClose: false,
            data: data,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit(): void {
        if (this.componentData.field) {
            this.fieldId = this.componentData.field?.id ?? '';
            this.title = 'EDIT_FIELD.TITLE_EDIT';
            this.saveButtonText = 'EDIT_FIELD.SAVE_EDIT';
            this.editForm.patchValue({
                displayName: this.componentData.field?.displayName,
                fieldType: this.componentData.field?.type,
                isRequired: this.componentData.field?.isRequired ?? false,
            });
            if (this.componentData.field.isSystem) {
                this.editForm.get('displayName')?.disable();
                this.editForm.get('fieldType')?.disable();
            } else {
                this.editForm.get('displayName')?.enable();
                this.editForm.get('fieldType')?.enable();
            }
        } else {
            this.title = 'EDIT_FIELD.TITLE_CREATE';
            this.saveButtonText = 'EDIT_FIELD.SAVE_CREATE';
            this.editForm.get('displayName')?.enable();
            this.editForm.get('fieldType')?.enable();
        }
    }

    saveChanges() {
        const updatedField = new CollectionFieldDto();
        updatedField.id = this.fieldId;
        updatedField.displayName = this.displayName?.value;
        updatedField.type = this.fieldType?.value;
        updatedField.order = this.componentData.field?.order ?? 0;
        updatedField.isSystem = this.componentData.field?.isSystem ?? false;
        this.dialogRef.close(updatedField);
    }

    get displayName() {
        return this.editForm.get('displayName');
    }

    get fieldType() {
        return this.editForm.get('fieldType');
    }

    get isRequired() {
        return this.editForm.get('isRequired');
    }
}

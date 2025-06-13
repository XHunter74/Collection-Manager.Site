import { Component, Inject, OnInit, Optional } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CollectionFieldDto } from '../../models/collection-field.dto';
import { Observable } from 'rxjs';
import { EditCollectionFieldModel } from '../../models/edit-collection-field.model';
import { FieldTypeDto } from '../../models/field-type.dto';

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
    fieldTypes: FieldTypeDto[] = [];
    // isRequired: boolean = false;

    editForm = new UntypedFormGroup({
        fieldName: new UntypedFormControl('', [Validators.required]),
        description: new UntypedFormControl(''),
        fieldType: new UntypedFormControl(''),
        isRequired: new UntypedFormControl(false),
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
            height: '450px',
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
                fieldName: this.componentData.field?.displayName,
                description: this.componentData.field?.description,
                fieldType: this.componentData.field?.type,
                isRequired: this.componentData.field?.isRequired ?? false,
            });
            if (this.componentData.field.isSystem) {
                this.editForm.get('fieldName')?.disable();
                this.editForm.get('fieldType')?.disable();
            } else {
                this.editForm.get('fieldName')?.enable();
                this.editForm.get('fieldType')?.enable();
            }
        } else {
            this.title = 'EDIT_FIELD.TITLE_CREATE';
            this.saveButtonText = 'EDIT_FIELD.SAVE_CREATE';
            this.editForm.get('fieldName')?.enable();
            this.editForm.get('fieldType')?.enable();
        }
        this.fieldTypes = this.componentData.fieldTypes;
    }

    saveChanges() {
        const updatedField = new CollectionFieldDto();
        updatedField.id = this.fieldId;
        updatedField.displayName = this.fieldName?.value;
        updatedField.description = this.description?.value;
        updatedField.type = this.fieldType?.value;
        updatedField.order = this.componentData.field?.order ?? 0;
        updatedField.isRequired = this.isRequired?.value;
        updatedField.isSystem = this.componentData.field?.isSystem ?? false;
        this.dialogRef.close(updatedField);
    }

    get fieldName() {
        return this.editForm.get('fieldName');
    }

    get description() {
        return this.editForm.get('description');
    }

    get fieldType() {
        return this.editForm.get('fieldType');
    }

    get isRequired() {
        return this.editForm.get('isRequired');
    }
}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ImagesService } from '../../../services/images.service';
import { FieldTypes } from '../../../models/field-types.enum';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.css'],
    standalone: false,
})
export class DynamicFormComponent implements OnInit {
    fieldTypes = FieldTypes;
    form!: FormGroup;
    collectionId: string | null = '9aa7d666-b7ef-4322-ab52-e0f9ceb94fc7';
    testImage = 'ae8b6ebe-5f1b-4d7f-ba62-bd17ad65eddc';

    config = [
        { label: 'Name', type: 0, value: 'Sample string' },
        { label: 'Description', type: 1, value: 'Sample text' },
        // { label: 'Age', type: 2, value: 30 },
        // { label: 'Amount', type: 4, value: 100.5 },
        // { label: 'Price', type: 3, value: 99.99 },
        // { label: 'Currency', type: 5, value: 'USD' },
        // { label: 'Start Date', type: 7, value: new Date() },
        // { label: 'End Time', type: 8, value: new Date(2025, 5, 12, 17, 27) },
        // { label: 'Active', type: 6, value: true },
        // { label: 'Yes/No', type: 9, value: false },
        // { label: 'Select', type: 10, value: 'opt2' },
        { label: 'Image', type: 11, value: 'ae8b6ebe-5f1b-4d7f-ba62-bd17ad65eddc' },
        // { label: 'Image', type: 11, value: null },
    ];

    constructor(
        private readonly dialogRef: MatDialogRef<DynamicFormComponent>,
        private formBuilder: FormBuilder,
        private utilsService: ImagesService,
    ) {}

    static show(dialog: MatDialog, width?: string, data?: any): Observable<any> {
        if (!width) {
            width = '430px';
        }
        const dialogRef = dialog.open(DynamicFormComponent, {
            width,
            height: '700px',
            disableClose: false,
            data: data,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            fields: this.formBuilder.array(
                this.config.map((f) => this.createControl(f.type, f.label, f.value)),
            ),
        });
    }

    get fieldsArray(): FormArray {
        return this.form.get('fields') as FormArray;
    }

    private createControl(type: number, fieldName: string, value: any): FormGroup {
        let initialValue = value;
        if (type === 7 && value instanceof Date) {
            initialValue = value.toISOString().substring(0, 10);
        }
        if (type === 11) {
            initialValue = this.utilsService.getImageUrl(this.collectionId!, value);
        }
        const ctrl = this.formBuilder.control(initialValue, Validators.required);
        return this.formBuilder.group({
            type: [type],
            fieldName: fieldName,
            control: ctrl,
        });
    }

    getOptions(type: number): any[] {
        if (type === 9)
            return [
                { v: true, l: 'DYNAMIC_FORM.YES' },
                { v: false, l: 'DYNAMIC_FORM.NO' },
            ];
        if (type === 10)
            return [
                { v: 'opt1', l: 'Option 1' },
                { v: 'opt2', l: 'Option 2' },
            ];
        return [];
    }

    onImageSelected(event: Event, index: number) {
        console.log('onImageSelected', event, index);
        const controlGroup = this.fieldsArray.at(index) as FormGroup;
        if (controlGroup && controlGroup.get('type')?.value === 11) {
            console.log(`Field name: '${controlGroup.get('fieldName')?.value}'`);
            controlGroup
                .get('control')
                ?.setValue(this.utilsService.getImageUrl(this.collectionId!, this.testImage));
        }
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const formData = this.form.value.fields.reduce((acc: any, field: any) => {
            if (field.type === 11) {
                acc[field.fieldName] = this.utilsService.extractImageIdFromUrl(field.control);
            } else {
                acc[field.fieldName] = field.control;
            }
            return acc;
        }, {});
        console.log('Form submitted:', formData);
        this.dialogRef.close(formData);
    }
}

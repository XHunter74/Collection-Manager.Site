import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

interface FieldType {
    name: string;
    value: number;
}

const FIELD_TYPES: FieldType[] = [
    { name: 'String', value: 0 },
    { name: 'Text', value: 1 },
    { name: 'Integer', value: 2 },
    { name: 'Money', value: 3 },
    { name: 'Decimal', value: 4 },
    { name: 'Currency', value: 5 },
    { name: 'Boolean', value: 6 },
    { name: 'Date', value: 7 },
    { name: 'Time', value: 8 },
    { name: 'YesNo', value: 9 },
    { name: 'Select', value: 10 },
    { name: 'Image', value: 11 },
];

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.css'],
    standalone: false,
})
export class DynamicFormComponent implements OnInit {
    form!: FormGroup;

    config = [
        { label: 'Name', type: 0 },
        { label: 'Description', type: 1 },
        { label: 'Age', type: 2 },
        { label: 'Price', type: 3 },
        { label: 'Start Date', type: 7 },
        { label: 'Active', type: 6 },
        { label: 'YesNo', type: 9 },
        { label: 'Select', type: 10 },
    ];

    constructor(
        private readonly dialogRef: MatDialogRef<DynamicFormComponent>,
        private fb: FormBuilder,
    ) {}

    static show(dialog: MatDialog, width?: string, data?: any): Observable<any> {
        if (!width) {
            width = '430px';
        }
        const dialogRef = dialog.open(DynamicFormComponent, {
            width,
            height: '550px',
            disableClose: false,
            data: data,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit() {
        this.form = this.fb.group({
            fields: this.fb.array(this.config.map((f) => this.createControl(f.type))),
        });
    }

    get fieldsArray(): FormArray {
        return this.form.get('fields') as FormArray;
    }

    private createControl(type: number): FormGroup {
        const ctrl = this.fb.control('', Validators.required);
        return this.fb.group({
            type: [type],
            control: ctrl,
        });
    }

    getOptions(type: number): any[] {
        if (type === 9)
            return [
                { v: true, l: 'Yes' },
                { v: false, l: 'No' },
            ];
        if (type === 10)
            return [
                { v: 'opt1', l: 'Option 1' },
                { v: 'opt2', l: 'Option 2' },
            ];
        return [];
    }

    onSubmit() {
        console.log(this.form.value);
    }
}

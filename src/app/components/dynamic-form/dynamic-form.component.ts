import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.css'],
    standalone: false,
})
export class DynamicFormComponent implements OnInit {
    form!: FormGroup;

    config = [
        { label: 'Name', type: 0, value: 'Sample string' },
        { label: 'Description', type: 1, value: 'Sample text' },
        { label: 'Age', type: 2, value: 30 },
        { label: 'Amount', type: 4, value: 100.5 },
        { label: 'Price', type: 3, value: 99.99 },
        { label: 'Currency', type: 5, value: 'USD' },
        { label: 'Start Date', type: 7, value: new Date() },
        { label: 'End Time', type: 8, value: new Date() },
        { label: 'Active', type: 6, value: true },
        { label: 'Yes/No', type: 9, value: false },
        { label: 'Select', type: 10, value: 'opt2' },
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
            height: '675px',
            disableClose: false,
            data: data,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit() {
        this.form = this.fb.group({
            fields: this.fb.array(this.config.map((f) => this.createControl(f.type, f.value))),
        });
    }

    get fieldsArray(): FormArray {
        return this.form.get('fields') as FormArray;
    }

    private createControl(type: number, value: any): FormGroup {
        let initialValue = value;
        if (type === 7 && value instanceof Date) {
            initialValue = value.toISOString().substring(0, 10);
        }
        if (type === 8 && value instanceof Date) {
            const hours = value.getHours().toString().padStart(2, '0');
            const minutes = value.getMinutes().toString().padStart(2, '0');
            initialValue = `${hours}:${minutes}`;
        }
        const ctrl = this.fb.control(initialValue, Validators.required);
        return this.fb.group({
            type: [type],
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

    onSubmit() {
        console.log(this.form.value);
    }
}

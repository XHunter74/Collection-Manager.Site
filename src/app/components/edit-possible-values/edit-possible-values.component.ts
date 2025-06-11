import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PossibleValueDto } from '../../models/possible-value.dto';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-edit-possible-values',
    templateUrl: './edit-possible-values.component.html',
    styleUrl: './edit-possible-values.component.css',
    standalone: false,
})
export class EditPossibleValuesComponent implements OnInit {
    sortedData = new MatTableDataSource<PossibleValueDto>();
    displayedColumns: string[] = ['value', 'buttons'];
    editingId: string | null = null;
    editedValue: string = '';
    newId: number = 0;

    constructor(
        private readonly dialogRef: MatDialogRef<EditPossibleValuesComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: PossibleValueDto[],
    ) {}

    static show(
        dialog: MatDialog,
        width?: string,
        data?: PossibleValueDto[],
    ): Observable<PossibleValueDto[]> {
        if (!width) {
            width = '470px';
        }
        const dialogRef = dialog.open(EditPossibleValuesComponent, {
            width,
            height: '450px',
            disableClose: false,
            data: data,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit(): void {
        if (this.componentData) {
            this.sortedData.data = this.componentData;
        }
    }

    startEdit(element: PossibleValueDto): void {
        this.editingId = element.id;
        this.editedValue = element.value;
    }

    saveEdit(element: PossibleValueDto): void {
        if (this.editingId === element.id) {
            element.value = this.editedValue;
            this.editingId = null;
            this.editedValue = '';
        }
    }

    cancelEdit(): void {
        this.editingId = null;
        this.editedValue = '';
    }

    saveChanges() {
        this.dialogRef.close(this.sortedData.data);
    }

    addValue() {
        const newId = --this.newId;
        const newValue = { id: newId.toString(), value: '' } as PossibleValueDto;
        this.sortedData.data = [...this.sortedData.data, newValue];
        this.editingId = newId.toString();
        this.editedValue = '';
    }

    deletePossibleValue(id: string) {
        const index = this.sortedData.data.findIndex((value) => value.id === id);
        if (index !== -1) {
            this.sortedData.data.splice(index, 1);
            this.sortedData._updateChangeSubscription();
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-edit-collection',
    templateUrl: './edit-collection.component.html',
    styleUrl: './edit-collection.component.css',
    standalone: false,
})
export class EditCollectionComponent implements OnInit {
    returnUrl: string = '';

    editForm = new UntypedFormGroup({
        userName: new UntypedFormControl('', [Validators.required]),
    });

    constructor(private readonly dialogRef: MatDialogRef<EditCollectionComponent>) {}

    static show(dialog: MatDialog, width?: string): Observable<string> {
        if (!width) {
            width = '400px';
        }
        const dialogRef = dialog.open(EditCollectionComponent, {
            width,
            height: '230px',
            disableClose: false,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit(): void {
        const userName = localStorage.getItem('user_name');
        this.editForm.patchValue({
            userName: userName,
        });
    }

    saveChanges() {
        this.dialogRef.close(this.userName?.value);
    }

    get userName() {
        return this.editForm.get('userName');
    }
}

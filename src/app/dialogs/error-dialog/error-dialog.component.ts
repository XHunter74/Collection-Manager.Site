import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogData } from '../../models/error-dialog-data';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.css'],
    standalone: false,
})
export class ErrorDialogComponent {
    static show(
        dialog: MatDialog,
        message: string,
        title: string,
        width?: string,
    ): Observable<boolean> {
        if (!width) {
            width = '500px';
        }
        if (!title) {
            title = 'COMMON.ERROR';
        }

        const dialogRef = dialog.open(ErrorDialogComponent, {
            width: width,
            height: '205px',
            data: new ErrorDialogData(message, title),
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData,
        private readonly dialogRef: MatDialogRef<ErrorDialogComponent>,
        private translate: TranslateService,
    ) {}

    closeDialog() {
        this.dialogRef.close(true);
    }
}

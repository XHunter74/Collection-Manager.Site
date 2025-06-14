import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-view-image-modal',
    templateUrl: './view-image-modal.component.html',
    styleUrl: './view-image-modal.component.css',
    standalone: false,
})
export class ViewImageModalComponent {
    constructor(
        private readonly dialogRef: MatDialogRef<ViewImageModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: string,
    ) {}

    static show(dialog: MatDialog, imageUrl?: string | undefined): Observable<string> {
        const dialogRef = dialog.open(ViewImageModalComponent, {
            width: '900px',
            maxWidth: '900px',
            height: '700px',
            disableClose: false,
            data: imageUrl,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }
}

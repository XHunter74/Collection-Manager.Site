import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionDialogDto } from '../../models/question-dialog.dto';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-dialog',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.css'],
    standalone: false,
})
export class QuestionDialogComponent {
    static async show(
        dialog: MatDialog,
        question: string,
        positiveButton?: string,
        negativeButton?: string,
        width?: string,
    ): Promise<string> {
        if (!width) {
            width = '500px';
        }
        if (!positiveButton) {
            positiveButton = 'BUTTONS.YES';
        }
        if (!negativeButton) {
            negativeButton = 'BUTTONS.NO';
        }
        const dialogRef = dialog.open(QuestionDialogComponent, {
            width,
            height: '170px',
            data: new QuestionDialogDto(question, positiveButton, negativeButton),
        });
        const dialogResult = await firstValueFrom(dialogRef.afterClosed());
        return dialogResult;
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionDialogDto) {}
}

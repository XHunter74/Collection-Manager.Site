import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-forgot-password-component',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    standalone: false,
})
export class ForgotPasswordComponent implements OnInit {
    returnUrl: string = '';

    restorePasswordForm = new UntypedFormGroup({
        userName: new UntypedFormControl('', [Validators.required]),
    });

    constructor(private readonly dialogRef: MatDialogRef<ForgotPasswordComponent>) {}

    static show(dialog: MatDialog, width?: string): Observable<string> {
        if (!width) {
            width = '400px';
        }
        const dialogRef = dialog.open(ForgotPasswordComponent, {
            width,
            height: '230px',
            disableClose: true,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit(): void {
        const userName = localStorage.getItem('user_name');
        this.restorePasswordForm.patchValue({
            userName: userName,
        });
    }

    forgotPassword() {
        this.dialogRef.close(this.userName?.value);
    }

    get userName() {
        return this.restorePasswordForm.get('userName');
    }
}

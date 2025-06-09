import { Component, OnInit } from '@angular/core';
import {
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-reset-password-modal',
    templateUrl: './reset-password-modal.component.html',
    styleUrl: './reset-password-modal.component.css',
    standalone: false,
})
export class ResetPasswordModalComponent {
    returnUrl: string = '';

    static passwordsMatchValidator: ValidatorFn = (
        control: AbstractControl,
    ): ValidationErrors | null => {
        const group = control as UntypedFormGroup;
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordsMismatch: true };
    };

    newPasswordForm = new UntypedFormGroup(
        {
            password: new UntypedFormControl('', [Validators.required]),
            confirmPassword: new UntypedFormControl('', [Validators.required]),
        },
        { validators: ResetPasswordModalComponent.passwordsMatchValidator },
    );

    constructor(private readonly dialogRef: MatDialogRef<ResetPasswordModalComponent>) {}

    static show(dialog: MatDialog, width?: string): Observable<string> {
        if (!width) {
            width = '400px';
        }
        const dialogRef = dialog.open(ResetPasswordModalComponent, {
            width,
            height: '340px',
            disableClose: true,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    changePassword() {
        if (this.newPasswordForm.invalid) {
            this.newPasswordForm.markAllAsTouched();
            return;
        }
        this.dialogRef.close(this.password?.value);
    }

    get password() {
        return this.newPasswordForm.get('password');
    }

    get confirmPassword() {
        return this.newPasswordForm.get('confirmPassword');
    }
}

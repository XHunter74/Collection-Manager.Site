import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LoginComponentModel } from '../models/login-component.model';

@Component({
    selector: 'app-login-modal-component',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css'],
    standalone: false,
})
export class LoginModalComponent implements OnInit {
    returnUrl: string = '';

    loginForm = new UntypedFormGroup({
        userName: new UntypedFormControl('', [Validators.required]),
        password: new UntypedFormControl('', [Validators.required]),
    });

    constructor(private readonly dialogRef: MatDialogRef<LoginModalComponent>) {}

    static show(dialog: MatDialog, width?: string): Observable<LoginComponentModel> {
        if (!width) {
            width = '400px';
        }
        const dialogRef = dialog.open(LoginModalComponent, {
            width,
            height: '370px',
            disableClose: true,
        });
        const dialogResult = dialogRef.afterClosed();
        return dialogResult;
    }

    ngOnInit(): void {
        const userName = localStorage.getItem('user_name');
        this.loginForm.patchValue({
            userName: userName,
        });
    }

    tryLogin() {
        console.log('Try to login...');
        const loginModel = new LoginComponentModel();
        loginModel.userName = this.userName?.value || '';
        loginModel.password = this.password?.value || '';
        loginModel.doLogin = true;
        this.dialogRef.close(loginModel);
    }

    forgotPassword() {
        const loginModel = new LoginComponentModel();
        loginModel.doRestorePassword = true;
        this.dialogRef.close(loginModel);
    }

    get userName() {
        return this.loginForm.get('userName');
    }
    get password() {
        return this.loginForm.get('password');
    }
}

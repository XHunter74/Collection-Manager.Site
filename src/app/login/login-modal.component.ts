import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

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

    constructor(
        private readonly dialogRef: MatDialogRef<LoginModalComponent>,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
    ) {}

    static show(dialog: MatDialog, width?: string) {
        if (!width) {
            width = '400px';
        }
        dialog.open(LoginModalComponent, {
            width,
            height: '370px',
            disableClose: true,
        });
    }

    ngOnInit(): void {
        const userName = localStorage.getItem('user_name');
        this.loginForm.patchValue({
            userName: userName,
        });
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || localStorage.getItem('last_url') || '/';
    }

    tryLogin() {
        console.log('Try to login...');
        this.authService.login(this.userName?.value, this.password?.value).then((result) => {
            if (result) {
                console.log('Login successful');
                this.dialogRef.close('Login successful');
                localStorage.setItem('user_name', this.userName?.value || '');
                localStorage.setItem('last_url', this.returnUrl);
                this.router.navigate([this.returnUrl]);
            } else {
                console.error('Login failed');
            }
        });
    }

    forgotPassword() {
        console.log('Forgot password clicked');
    }

    get userName() {
        return this.loginForm.get('userName');
    }
    get password() {
        return this.loginForm.get('password');
    }
}

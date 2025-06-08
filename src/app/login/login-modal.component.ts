import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-login-modal-component',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css'],
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule , MatDialogModule],
    standalone: true
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
        private dialog: MatDialog,
    ) { }

    static show(dialog: MatDialog, width?: string) {
        if (!width) {
            width = '400px';
        }
        dialog.open(LoginModalComponent, {
            width,
            height: '340px',
            hasBackdrop: true, // show overlay
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
    }

    processCancel() {
        this.dialogRef.close('Cancel click');
        this.router.navigate(['/']);
    }

    get userName() {
        return this.loginForm.get('userName');
    }
    get password() {
        return this.loginForm.get('password');
    }
}

import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login-modal-component',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css'],
    standalone: false
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
        private translate: TranslateService,
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

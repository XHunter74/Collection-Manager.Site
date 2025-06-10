import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { LoginModalComponent } from './login-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponentModel } from '../../models/login-component.model';
import { MessageDialogComponent } from '../dialogs/message-dialog.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { UsersService } from '../../services/users.service';
import { Constants } from '../../shared/constants';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
    private subscriptions: any[] = [];

    constructor(
        private matDialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UsersService,
    ) {}

    ngAfterViewInit(): void {
        this.processLogin();
    }

    private processLogin() {
        const loginModalSub = LoginModalComponent.show(this.matDialog).subscribe(
            (result: LoginComponentModel) => {
                if (result.doLogin) {
                    this.handleLogin(result.userName, result.password);
                } else if (result.doRestorePassword) {
                    this.handleRestorePassword();
                }
            },
        );
        this.subscriptions.push(loginModalSub);
    }

    private handleLogin(userName: string, password: string): void {
        const loginSub = this.userService.login(userName, password).subscribe({
            next: (loginResult) => this.handleLoginResult(loginResult, userName),
            error: (err) => this.handleLoginError(err),
        });
        this.subscriptions.push(loginSub);
    }

    private handleLoginResult(loginResult: any, userName: string): void {
        if (loginResult) {
            console.log('Login successful');
            localStorage.setItem('user_name', userName);
            let returnUrl = this.route.snapshot.queryParams['returnUrl'] || Constants.HomeUrl;
            if (Array.isArray(returnUrl)) {
                returnUrl = returnUrl[0] || Constants.HomeUrl;
            }
            if (typeof returnUrl !== 'string') {
                returnUrl = String(returnUrl);
            }
            if (!returnUrl.startsWith('/')) {
                returnUrl = '/' + returnUrl;
            }
            this.router.navigateByUrl(returnUrl);
        } else {
            this.handleLoginFailed();
        }
    }

    private handleLoginFailed(): void {
        console.error('Login failed');
        const dialogSub = MessageDialogComponent.show(
            this.matDialog,
            'LOGIN.LOGIN_FAILED',
            'LOGIN.DIALOG_TITLE',
        ).subscribe(() => {
            this.processLogin();
        });
        this.subscriptions.push(dialogSub);
    }

    private handleLoginError(err: any): void {
        console.error('Login error:', err);
        const dialogSub = MessageDialogComponent.show(
            this.matDialog,
            'LOGIN.LOGIN_FAILED',
            'LOGIN.DIALOG_TITLE',
        ).subscribe(() => {
            this.processLogin();
        });
        this.subscriptions.push(dialogSub);
    }

    private handleRestorePassword(): void {
        const forgotSub = ForgotPasswordComponent.show(this.matDialog).subscribe((email) => {
            if (email) {
                this.handleSendResetPasswordLink(email);
            }
        });
        this.subscriptions.push(forgotSub);
    }

    private handleSendResetPasswordLink(email: string): void {
        const resetSub = this.userService.sendResetPasswordLink(email).subscribe({
            next: () => this.handleResetPasswordSuccess(),
            error: (err) => this.handleResetPasswordError(err),
        });
        this.subscriptions.push(resetSub);
    }

    private handleResetPasswordSuccess(): void {
        console.log('Reset password link sent successfully');
        const dialogSub = MessageDialogComponent.show(
            this.matDialog,
            'FORGOT_PASSWORD.RESTORE_PASSWORD_SUCCESS',
            'FORGOT_PASSWORD.TITLE',
        ).subscribe(() => {
            this.processLogin();
        });
        this.subscriptions.push(dialogSub);
    }

    private handleResetPasswordError(err: any): void {
        console.error('Error sending reset password link:', err);
        const dialogSub = MessageDialogComponent.show(
            this.matDialog,
            'FORGOT_PASSWORD.RESTORE_PASSWORD_FAILED',
            'FORGOT_PASSWORD.TITLE',
        ).subscribe(() => {
            this.processLogin();
        });
        this.subscriptions.push(dialogSub);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(
            (sub) => sub && typeof sub.unsubscribe === 'function' && sub.unsubscribe(),
        );
    }
}

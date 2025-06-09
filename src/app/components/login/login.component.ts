import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { LoginModalComponent } from './login-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponentModel } from '../../models/login-component.model';
import { ErrorDialogComponent } from '../dialogs/message-dialog.component';
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
                    console.log('Login attempt with user:', result.userName);
                    const loginSub = this.userService
                        .login(result.userName, result.password)
                        .subscribe({
                            next: (loginResult) => {
                                if (loginResult) {
                                    console.log('Login successful');
                                    localStorage.setItem('user_name', result.userName);
                                    let returnUrl =
                                        this.route.snapshot.queryParams['returnUrl'] ||
                                        Constants.HOME;
                                    if (!returnUrl.startsWith('/')) {
                                        returnUrl = '/' + returnUrl;
                                    }
                                    this.router.navigateByUrl(returnUrl);
                                } else {
                                    console.error('Login failed');
                                    const dialogSub = ErrorDialogComponent.show(
                                        this.matDialog,
                                        'LOGIN.LOGIN_FAILED',
                                        'LOGIN.DIALOG_TITLE',
                                    ).subscribe(() => {
                                        this.processLogin();
                                    });
                                    this.subscriptions.push(dialogSub);
                                }
                            },
                            error: (err) => {
                                console.error('Login error:', err);
                                const dialogSub = ErrorDialogComponent.show(
                                    this.matDialog,
                                    'LOGIN.LOGIN_FAILED',
                                    'LOGIN.DIALOG_TITLE',
                                ).subscribe(() => {
                                    this.processLogin();
                                });
                                this.subscriptions.push(dialogSub);
                            },
                        });
                    this.subscriptions.push(loginSub);
                } else if (result.doRestorePassword) {
                    console.log('Restore password requested');
                    const forgotSub = ForgotPasswordComponent.show(this.matDialog).subscribe(
                        (email) => {
                            if (email) {
                                console.log('Password restoration for user:', email);
                                const resetSub = this.userService
                                    .sendResetPasswordLink(email)
                                    .subscribe({
                                        next: () => {
                                            console.log('Reset password link sent successfully');
                                            const dialogSub = ErrorDialogComponent.show(
                                                this.matDialog,
                                                'FORGOT_PASSWORD.RESTORE_PASSWORD_SUCCESS',
                                                'FORGOT_PASSWORD.TITLE',
                                            ).subscribe(() => {
                                                this.processLogin();
                                            });
                                            this.subscriptions.push(dialogSub);
                                        },
                                        error: (err) => {
                                            console.error(
                                                'Error sending reset password link:',
                                                err,
                                            );
                                            const dialogSub = ErrorDialogComponent.show(
                                                this.matDialog,
                                                'FORGOT_PASSWORD.RESTORE_PASSWORD_FAILED',
                                                'FORGOT_PASSWORD.TITLE',
                                            ).subscribe(() => {
                                                this.processLogin();
                                            });
                                            this.subscriptions.push(dialogSub);
                                        },
                                    });
                                this.subscriptions.push(resetSub);
                            }
                        },
                    );
                    this.subscriptions.push(forgotSub);
                }
            },
        );
        this.subscriptions.push(loginModalSub);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(
            (sub) => sub && typeof sub.unsubscribe === 'function' && sub.unsubscribe(),
        );
    }
}

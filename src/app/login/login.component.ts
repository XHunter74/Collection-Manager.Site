import { AfterViewInit, Component } from '@angular/core';
import { LoginModalComponent } from './login-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponentModel } from '../models/login-component.model';
import { AuthService } from '../services/auth.service';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { UsersService } from '../services/users.service';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
    constructor(
        private matDialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private userService: UsersService,
    ) {}

    ngAfterViewInit(): void {
        this.processLogin();
    }

    private processLogin() {
        LoginModalComponent.show(this.matDialog).subscribe((result: LoginComponentModel) => {
            if (result.doLogin) {
                console.log('Login attempt with user:', result.userName);
                this.userService.login(result.userName, result.password).subscribe({
                    next: (loginResult) => {
                        if (loginResult) {
                            console.log('Login successful');
                            localStorage.setItem('user_name', result.userName);
                            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                            this.router.navigateByUrl(returnUrl);
                        } else {
                            console.error('Login failed');
                            ErrorDialogComponent.show(
                                this.matDialog,
                                'LOGIN.LOGIN_FAILED',
                                'LOGIN.DIALOG_TITLE',
                            ).subscribe(() => {
                                this.processLogin();
                            });
                        }
                    },
                    error: (err) => {
                        console.error('Login error:', err);
                        ErrorDialogComponent.show(
                            this.matDialog,
                            'LOGIN.LOGIN_FAILED',
                            'LOGIN.DIALOG_TITLE',
                        ).subscribe(() => {
                            this.processLogin();
                        });
                    },
                });
            } else if (result.doRestorePassword) {
                console.log('Restore password requested');
                ForgotPasswordComponent.show(this.matDialog).subscribe((email) => {
                    if (email) {
                        console.log('Password restoration for user:', email);
                    }
                });
            }
        });
    }
}

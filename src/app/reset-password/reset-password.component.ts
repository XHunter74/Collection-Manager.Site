import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordModalComponent } from './reset-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../services/users.service';
import { ErrorDialogComponent } from '../dialogs/message-dialog/message-dialog.component';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
    standalone: false,
})
export class ResetPasswordComponent implements OnInit {
    userId: string | null = null;
    token: string | null = null;

    constructor(
        private matDialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UsersService,
    ) {}

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('userId');
        this.token = this.route.snapshot.paramMap.get('token');

        if (!this.userId || !this.token) {
            this.userId = this.route.snapshot.queryParamMap.get('userId');
            this.token = this.route.snapshot.queryParamMap.get('token');
        }
        console.log('User ID:', this.userId);
        console.log('Token:', this.token);
        ResetPasswordModalComponent.show(this.matDialog).subscribe((result: string) => {
            if (result) {
                this.userService.resetPassword(this.userId!, this.token!, result).subscribe({
                    next: () => {
                        ErrorDialogComponent.show(
                            this.matDialog,
                            'RESET_PASSWORD.RESET_SUCCESS',
                            'RESET_PASSWORD.TITLE',
                        ).subscribe(() => {
                            this.router.navigate(['']);
                        });
                    },
                    error: (err) => {
                        console.error('Reset password error:', err);
                        ErrorDialogComponent.show(
                            this.matDialog,
                            'RESET_PASSWORD.RESET_FAILED',
                            'RESET_PASSWORD.TITLE',
                        ).subscribe(() => {
                            this.router.navigate(['']);
                        });
                    },
                });
            } else {
                console.log('No new password entered');
                ErrorDialogComponent.show(
                    this.matDialog,
                    'RESET_PASSWORD.ERROR',
                    'RESET_PASSWORD.TITLE',
                ).subscribe(() => {
                    this.router.navigate(['']);
                });
            }
        });
    }
}

import { AfterViewInit, Component } from '@angular/core';
import { LoginModalComponent } from './login-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponentModel } from '../models/login-component.model';
import { AuthService } from '../services/auth.service';

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
    ) {}

    ngAfterViewInit(): void {
        LoginModalComponent.show(this.matDialog).subscribe((result: LoginComponentModel) => {
            if (result.doLogin) {
                console.log('Login attempt with user:', result.userName);
                this.authService.login(result.userName, result.password).then((loginResult) => {
                    if (loginResult) {
                        console.log('Login successful');
                        localStorage.setItem('user_name', result.userName);
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                        this.router.navigateByUrl(returnUrl);
                    } else {
                        console.error('Login failed');
                    }
                });
            } else if (result.doRestorePassword) {
                console.log('Restore password requested for user:', result.userName);
            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
    standalone: false,
})
export class ResetPasswordComponent implements OnInit {
    userId: string | null = null;
    token: string | null = null;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('userId');
        this.token = this.route.snapshot.paramMap.get('token');

        if (!this.userId || !this.token) {
            this.userId = this.route.snapshot.queryParamMap.get('userId');
            this.token = this.route.snapshot.queryParamMap.get('token');
        }
        console.log('User ID:', this.userId);
        console.log('Token:', this.token);
    }
}

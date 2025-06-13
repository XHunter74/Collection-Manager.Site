// filepath: c:\Sources\My Projects\Collection Manager Site\src\app\modules\login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../components/login-module/login/login.component';
import { ForgotPasswordComponent } from '../components/login-module/forgot-password/forgot-password.component';
import { UsersService } from '../services/users.service';
import { ResetPasswordComponent } from '../components/login-module/reset-password/reset-password.component';
import { ResetPasswordModalComponent } from '../components/login-module/reset-password-modal/reset-password-modal.component';
import { LoginModalComponent } from '../components/login-module/login-modal/login-modal.component';

@NgModule({
    declarations: [
        LoginComponent,
        LoginModalComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        ResetPasswordModalComponent,
    ],
    bootstrap: [],
    imports: [
        CommonModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
    ],
    providers: [UsersService],
    exports: [LoginComponent, ResetPasswordComponent],
})
export class LoginModule {}

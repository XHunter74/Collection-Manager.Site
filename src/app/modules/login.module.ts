// filepath: c:\Sources\My Projects\Collection Manager Site\src\app\modules\login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from '../login/login-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { ForgotPasswordComponent } from '../login/forgot-password.component';
import { UsersService } from '../services/users.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ResetPasswordModalComponent } from '../reset-password/reset-password-modal.component';

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

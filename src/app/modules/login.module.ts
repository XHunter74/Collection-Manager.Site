// filepath: c:\Sources\My Projects\Collection Manager Site\src\app\modules\login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from '../login/login-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';

@NgModule({
    declarations: [LoginComponent, LoginModalComponent],
    bootstrap: [],
    imports: [
        CommonModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
    ],
    providers: [],
    exports: [LoginComponent],
})
export class LoginModule {}

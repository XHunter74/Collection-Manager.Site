import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../components/login/login.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}

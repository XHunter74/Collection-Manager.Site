import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../components/login-module/login/login.component';
import { ResetPasswordComponent } from '../components/login-module/reset-password/reset-password.component';
import { AuthGuard } from '../guards/auth.guard';
import { CollectionsComponent } from '../components/collection-module/collections/collections.component';
import { ManageCollectionsComponent } from '../components/management-module/manage-collections/manage-collections.component';
import { TestComponent } from '../components/shared-module/test/test.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'collections', component: CollectionsComponent, canActivate: [AuthGuard] },
    { path: 'manage-collections', component: ManageCollectionsComponent, canActivate: [AuthGuard] },
    { path: 'test', component: TestComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}

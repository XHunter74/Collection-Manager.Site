import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppMaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { appInitializerFactory, HttpLoaderFactory } from './app-initialize.factory';
import { ErrorDialogComponent } from '../components/dialogs/message-dialog.component';
import { LoginModule } from './login.module';

@NgModule({
    declarations: [AppComponent, ErrorDialogComponent],
    bootstrap: [AppComponent],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        LoginModule,
        TranslateModule.forRoot({
            defaultLanguage: environment.defaultLocale,
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true,
        },
    ],
})
export class AppModule {
    constructor() {}
}

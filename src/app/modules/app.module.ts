import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { AppMaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { appInitializerFactory, HttpLoaderFactory } from './app-initialize.factory';
import { MessageDialogComponent } from '../components/dialogs/message-dialog.component';
import { LoginModule } from './login.module';
import { AppHttpInterceptor } from '../interceptors/http.interceptor';
import { CollectionsModule } from './collections.module';
import { AuthGuard } from '../guards/auth.guard';
import { ManageCollectionsModule } from './manage-collections.module';
import { QuestionDialogComponent } from '../components/dialogs/question-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter } from '../adapters/app-date.adapter';
import { APP_DATE_FORMATS } from '../adapters/app-date-format';

@NgModule({
    declarations: [AppComponent, MessageDialogComponent, QuestionDialogComponent],
    bootstrap: [AppComponent],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        LoginModule,
        CollectionsModule,
        ManageCollectionsModule,
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
        AuthGuard,
        { provide: DateAdapter, useClass: AppDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    ],
})
export class AppModule {
    constructor() {}
}

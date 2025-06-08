import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false,
})
export class AppComponent {
    title = 'collection-manager';

    constructor(translate: TranslateService) {
        translate.setDefaultLang(environment.defaultLocale);
    }
}

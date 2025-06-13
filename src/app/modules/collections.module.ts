// filepath: c:\Sources\My Projects\Collection Manager Site\src\app\modules\login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { CollectionsComponent } from '../components/collection-module/collections/collections.component';
import { SelectCollectionComponent } from '../components/collection-module/select-collection/select-collection.component';
import { CollectionsService } from '../services/collections.service';
import { ItemsPanelComponent } from '../components/collection-module/items-panel/items-panel.component';
import { CollectionItemsComponent } from '../components/collection-module/collection-items/collection-items.component';
import { ItemComponent } from '../components/collection-module/item/item.component';
import { DynamicFormComponent } from '../components/collection-module/dynamic-form/dynamic-form.component';

@NgModule({
    declarations: [
        CollectionsComponent,
        SelectCollectionComponent,
        ItemsPanelComponent,
        CollectionItemsComponent,
        ItemComponent,
        DynamicFormComponent,
    ],
    bootstrap: [],
    imports: [
        CommonModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
    ],
    providers: [UsersService, CollectionsService],
    exports: [CollectionsComponent],
})
export class CollectionsModule {}

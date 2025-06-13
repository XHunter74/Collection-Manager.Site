// filepath: c:\Sources\My Projects\Collection Manager Site\src\app\modules\login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { CollectionsService } from '../services/collections.service';
import { EditCollectionComponent } from '../components/management-module/edit-collection/edit-collection.component';
import { ManageCollectionsComponent } from '../components/management-module/manage-collections/manage-collections.component';
import { FieldsListComponent } from '../components/management-module/fields-list/fields-list.component';
import { CollectionsListComponent } from '../components/management-module/collections-list/collections-list.component';
import { EditCollectionFieldComponent } from '../components/management-module/edit-collection-field/edit-collection-field.component';
import { EditPossibleValuesComponent } from '../components/management-module/edit-possible-values/edit-possible-values.component';

@NgModule({
    declarations: [
        ManageCollectionsComponent,
        FieldsListComponent,
        CollectionsListComponent,
        EditCollectionComponent,
        EditCollectionFieldComponent,
        EditPossibleValuesComponent,
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
    exports: [ManageCollectionsComponent],
})
export class ManageCollectionsModule {}

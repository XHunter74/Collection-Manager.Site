// filepath: c:\Sources\My Projects\Collection Manager Site\src\app\modules\login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { SelectCollectionComponent } from '../components/select-collection/select-collection.component';
import { CollectionsService } from '../services/collections.service';
import { ItemsComponent } from '../components/items/items.component';

@NgModule({
    declarations: [DashboardComponent, SelectCollectionComponent, ItemsComponent],
    bootstrap: [],
    imports: [
        CommonModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
    ],
    providers: [UsersService, CollectionsService],
    exports: [DashboardComponent],
})
export class CollectionsModule {}

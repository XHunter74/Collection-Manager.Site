import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    exports: [
        MatButtonModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatTimepickerModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatSelectModule,
        MatCheckboxModule,
    ],
})
export class AppMaterialModule {}

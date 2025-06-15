import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestComponent } from '../components/shared-module/test/test.component';
import { ImageControlComponent } from '../components/shared-module/image-control/image-control.component';
import { ViewImageModalComponent } from '../components/shared-module/view-image-modal/view-image-modal.component';
import { ImagesControlComponent } from '../components/shared-module/images-control/images-control.component';

@NgModule({
    declarations: [
        TestComponent,
        ImageControlComponent,
        ViewImageModalComponent,
        ImagesControlComponent,
    ],
    bootstrap: [],
    imports: [
        CommonModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
    ],
    exports: [ImageControlComponent, ViewImageModalComponent, ImagesControlComponent],
})
export class SharedModule {}

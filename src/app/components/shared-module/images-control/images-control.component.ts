import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ImagesService } from '../../../services/images.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageModalComponent } from '../view-image-modal/view-image-modal.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-images-control',
    templateUrl: './images-control.component.html',
    styleUrl: './images-control.component.css',
    standalone: false,
})
export class ImagesControlComponent implements OnChanges {
    @Input() images: string[] = [];
    @Input() collectionId: string | null = null;
    @Output() imagesChange = new EventEmitter<string[]>();

    form!: FormGroup;

    constructor(
        private matDialog: MatDialog,
        private formBuilder: FormBuilder,
        private imagesService: ImagesService,
    ) {}

    ngOnChanges(): void {
        this.createDynamicForm();
    }

    createDynamicForm(): void {
        this.form = this.formBuilder.group({
            images: this.formBuilder.array(this.images.map((f) => this.createControl(f))),
        });
        // this.fillDynamicForm();
    }

    private createControl(imageId: string): FormGroup {
        const ctrl = this.formBuilder.control(imageId);

        return this.formBuilder.group({
            control: ctrl,
        });
    }

    get imagesArray(): FormArray {
        if (!this.form) {
            return [] as unknown as FormArray;
        }
        return this.form.get('images') as FormArray;
    }

    addImage(): void {
        const newImageId = '';
        this.imagesArray.push(this.createControl(newImageId));
        this.images.push(newImageId);
        this.imagesChange.emit(this.images);
    }

    getImageUrl(idx: number): string | null {
        const imageId = this.images[idx];
        return this.imagesService.getImageUrl(this.collectionId || '', imageId || '');
    }

    deleteImage(idx: number): void {
        if (idx < 0 || idx >= this.images.length) {
            console.warn('Invalid image index for deletion:', idx);
            return;
        }
        this.images.splice(idx, 1);
    }

    enlargeImage(idx: number): void {
        ViewImageModalComponent.show(this.matDialog, this.getImageUrl(idx) ?? undefined);
    }

    formImageWasChanged(event: string | null, controlIdx: number): void {
        const oldValue = this.images[controlIdx];
        if (oldValue != event) {
            this.images[controlIdx] = event || '';
            const control = this.imagesArray.at(controlIdx).get('control');
            if (control) {
                control.setValue(event);
                this.form.markAsDirty();
            }
            this.imagesChange.emit(this.images.filter((img) => img && img.length > 0));
        }
    }
}

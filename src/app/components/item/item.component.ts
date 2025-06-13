import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseItemModel } from '../../models/base-item.model';
import { CollectionMetadataModel } from '../../models/collection-metadata.model';
import { CollectionsService } from '../../services/collections.service';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-item-component',
    templateUrl: './item.component.html',
    styleUrl: './item.component.css',
    standalone: false,
})
export class ItemComponent implements OnChanges {
    form!: FormGroup;
    @Input() collectionMetadata: CollectionMetadataModel | null = null;
    @Input() itemId: string | null = null;

    itemData: BaseItemModel | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private utilsService: UtilsService,
        private collectionsService: CollectionsService,
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ngOnChanges(changes: SimpleChanges): void {
        if (this.collectionMetadata) {
            this.createDynamicForm();
        }
    }

    createDynamicForm(): void {
        this.form = this.formBuilder.group({
            fields: this.formBuilder.array(
                this.collectionMetadata!.fields.map((f) =>
                    this.createControl(f.type!, f.id!, f.isRequired!),
                ),
            ),
        });
        this.fillDynamicForm();
    }

    get fieldsArray(): FormArray {
        if (!this.form) {
            return [] as unknown as FormArray;
        }
        return this.form.get('fields') as FormArray;
    }

    private createControl(type: number, fieldId: string, isRequired: boolean): FormGroup {
        let ctrl: FormControl;
        let initialValue: any = null;

        if (type === 11) {
            initialValue = this.utilsService.getImageUrl(
                this.collectionMetadata!.collection!.id!,
                '',
            );
        }

        if (isRequired) {
            ctrl = this.formBuilder.control(initialValue, Validators.required);
        } else {
            ctrl = this.formBuilder.control(initialValue);
        }

        return this.formBuilder.group({
            type: [type],
            fieldId: fieldId,
            control: ctrl,
        });
    }

    fillDynamicForm(): void {
        if (this.itemId && this.itemId.length > 0) {
            this.collectionsService.loadItemData(this.itemId).subscribe({
                next: (itemData: BaseItemModel) => {
                    this.itemData = itemData;
                    this.patchFormValues(itemData);
                },
                error: (err: any) => {
                    console.error('Error loading item data:', err);
                    this.itemData = null;
                },
            });
        }
    }

    private patchFormValues(itemData: BaseItemModel): void {
        if (!this.collectionMetadata || !this.form) return;
        const fields = this.collectionMetadata.fields;
        const fieldsArray = this.fieldsArray;
        if (!fieldsArray) return;

        fields.forEach((field, idx) => {
            const controlGroup = fieldsArray.at(idx) as FormGroup;
            if (!controlGroup) return;
            const fieldName = field.displayName;
            if (!fieldName) return;
            let value = itemData[fieldName];

            switch (field.type) {
                case 7: // Date
                    if (value) {
                        const date = new Date(value as string);
                        value = date.toISOString().substring(0, 10);
                    }
                    break;
                case 8: // Time
                    if (value) {
                        const date = new Date(value as string);
                        value = date;
                    }
                    break;
                case 11: // Image
                    value = this.utilsService.getImageUrl(
                        this.collectionMetadata!.collection!.id!,
                        value as string,
                    );
                    break;
                default:
                    break;
            }
            controlGroup.get('control')?.patchValue(value);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onImageSelected(event: Event, idx: number) {}

    getOptions(fieldIdx: number): any[] {
        const field = this.collectionMetadata!.fields[fieldIdx];
        if (!field) return [];
        if (field.type != 10) return [];
        const fieldPossibleValues = this.collectionMetadata!.possibleValues.find(
            (e) => e.fieldId === field.id,
        );
        if (fieldPossibleValues) {
            return fieldPossibleValues.possibleValues.map((v) => ({
                v: v.id,
                l: v.value,
            }));
        }
        return [];
    }

    getYesNoOptions(): any[] {
        return [
            { v: true, l: 'DYNAMIC_FORM.YES' },
            { v: false, l: 'DYNAMIC_FORM.NO' },
        ];
    }

    get isSaveButtonDisabled(): boolean {
        return false;
    }

    saveItem(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formData = this.form.value.fields.reduce((acc: any, formField: any) => {
            const field = this.collectionMetadata!.fields.find((f) => f.id === formField.fieldId);
            const fieldName = field!.displayName!;
            if (formField.type === 11) {
                acc[fieldName] = this.utilsService.extractImageIdFromUrl(formField.control);
            } else {
                acc[fieldName] = formField.control;
            }
            return acc;
        }, {});

        const itemData: BaseItemModel = {
            id: this.itemId,
            collectionId: this.collectionMetadata!.collection!.id!,
            ...formData,
        };

        if (itemData) {
            console.log('Item data to save:', itemData);
        }
        // this.collectionsService.saveItemData(itemData).subscribe({
        //     next: () => {
        //         console.log('Item saved successfully');
        //         // Optionally, you can reset the form or navigate away
        //     },
        //     error: (err: any) => {
        //         console.error('Error saving item data:', err);
        //     },
        // });
    }
}

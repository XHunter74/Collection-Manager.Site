import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseItemModel, ItemValue } from '../../../models/base-item.model';
import { CollectionMetadataModel } from '../../../models/collection-metadata.model';
import { CollectionsService } from '../../../services/collections.service';
import { FieldTypes } from '../../../models/field-types.enum';

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
    @Output() displayNameChange = new EventEmitter<string | null>();

    displayName: string | null = null;
    uploadingImage: boolean = false;
    itemData: BaseItemModel | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private collectionsService: CollectionsService,
    ) {}

    ngOnChanges(): void {
        if (this.collectionMetadata) {
            this.collectionMetadata.fields = this.collectionMetadata.fields.filter(
                (f) => f.isSystem === false,
            );
            this.createDynamicForm();
        }
    }

    createDynamicForm(): void {
        this.form = this.formBuilder.group({
            displayName: ['', Validators.required],
            picture: [''],
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
            initialValue = '';
        } else if (type === 12) {
            initialValue = [];
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
        this.displayName = itemData.displayName || null;
        this.form.patchValue({
            displayName: itemData.displayName || '',
            picture: itemData.picture || '',
        });
        if (!this.collectionMetadata || !this.form) return;
        const fields = this.collectionMetadata.fields;
        const fieldsArray = this.fieldsArray;
        if (!fieldsArray) return;

        fields.forEach((field, idx) => {
            const controlGroup = fieldsArray.at(idx) as FormGroup;
            if (!controlGroup) return;
            const fieldName = field.displayName;
            if (!fieldName) return;

            let value: any = itemData.values.find((v) => v.fieldId === field.id)?.value || null;

            switch (field.type) {
                case FieldTypes.Date: // Date
                    if (value) {
                        const date = new Date(value as string);
                        value = date.toISOString().substring(0, 10);
                    }
                    break;
                case FieldTypes.Time: // Time
                    if (value) {
                        const date = new Date(value as string);
                        value = date;
                    }
                    break;
                case FieldTypes.Image: // Image
                    value = value as string;
                    break;
                case FieldTypes.Select: // Select
                    {
                        if (value) {
                            const fieldPossibleValues =
                                this.collectionMetadata!.possibleValues.find(
                                    (e) => e.fieldId === field.id,
                                );
                            const itemPossibleValue = fieldPossibleValues?.possibleValues.find(
                                (v) => v.value === value,
                            );
                            value = itemPossibleValue?.id || null;
                        }
                    }
                    break;
                default:
                    break;
            }
            controlGroup.get('control')?.patchValue(value);
        });
    }

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
        return this.form.invalid || this.form.pristine;
    }

    saveItem(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formData: BaseItemModel = this.form.value.fields.reduce(
            (acc: BaseItemModel, formField: any) => {
                if (acc.values === undefined) {
                    acc.values = [];
                }
                const field = this.collectionMetadata!.fields.find(
                    (f) => f.id === formField.fieldId,
                );
                const fieldId = field!.id!;
                const fieldName = field!.displayName!;
                switch (field!.type) {
                    case FieldTypes.Image:
                        {
                            const newValue = new ItemValue();
                            newValue.fieldId = fieldId;
                            newValue.fieldName = fieldName;
                            newValue.value = formField.control;
                            acc.values.push(newValue);
                        }
                        break;
                    case FieldTypes.Select:
                        {
                            const controlValue = formField.control;
                            const fieldPossibleValues =
                                this.collectionMetadata!.possibleValues.find(
                                    (e) => e.fieldId === fieldId,
                                );
                            const itemPossibleValue = fieldPossibleValues?.possibleValues.find(
                                (v) => v.id === controlValue,
                            );
                            const newValue = new ItemValue();
                            newValue.fieldId = fieldId;
                            newValue.fieldName = fieldName;
                            newValue.value = itemPossibleValue?.value || null;
                            acc.values.push(newValue);
                        }
                        break;
                    default:
                        {
                            const newValue = new ItemValue();
                            newValue.fieldId = fieldId;
                            newValue.fieldName = fieldName;
                            newValue.value = formField.control;
                            acc.values.push(newValue);
                        }
                        break;
                }
                return acc as BaseItemModel;
            },
            {},
        );

        formData.collectionId = this.collectionMetadata!.collection.id!;
        formData.id = this.itemId || undefined;
        formData.picture = this.form.value.picture || '';

        if (this.form.value.displayName != this.displayName) {
            this.displayNameChange.emit(this.form.value.displayName);
        }
        formData.displayName = this.form.value.displayName || '';

        if (formData) {
            console.log('Item data to save:', formData);
            if (formData.id) {
                this.collectionsService.updateCollectionItem(formData).subscribe({
                    next: () => {
                        this.form.markAsPristine();
                        console.log('Item updated successfully');
                    },
                    error: (err: any) => {
                        console.error('Error updating item data:', err);
                    },
                });
            } else {
                this.collectionsService
                    .createCollectionItem(formData.collectionId, formData)
                    .subscribe({
                        next: (newItem: BaseItemModel) => {
                            console.log('Item created successfully:', newItem);
                        },
                        error: (err: any) => {
                            console.error('Error creating item data:', err);
                        },
                    });
            }
        }
    }

    pictureWasChanged(event: string | null): void {
        this.form.get('picture')!.setValue(event);
        this.form.markAsDirty();
    }

    formImageWasChanged(event: string | null, controlIdx: number): void {
        const control = this.fieldsArray.at(controlIdx).get('control');
        if (control) {
            control.setValue(event);
            this.form.markAsDirty();
        }
    }

    formImagesWasChanged(event: string[], controlIdx: number): void {
        const control = this.fieldsArray.at(controlIdx).get('control');
        if (control) {
            control.setValue(event);
            this.form.markAsDirty();
        }
    }
}

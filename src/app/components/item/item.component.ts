import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { BaseItemModel } from '../../models/base-item.model';
import { CollectionMetadataModel } from '../../models/collection-metadata.model';

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

    itemData: BaseItemModel[] | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private utilsService: UtilsService,
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private patchFormValues(itemData: BaseItemModel[]): void {}

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
}

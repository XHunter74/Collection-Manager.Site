import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { CollectionFieldDto } from '../../models/collection-field.dto';
import { BaseItemModel } from '../../models/base-item.model';
import { PossibleValuesHolder } from '../../models/possible-values.holder';

@Component({
    selector: 'app-item-component',
    templateUrl: './item.component.html',
    styleUrl: './item.component.css',
    standalone: false,
})
export class ItemComponent implements OnInit, OnChanges {
    form!: FormGroup;
    @Input() currentCollection: CollectionDto | null = null;
    @Input() itemId: string | null = null;
    @Input() collectionFields: CollectionFieldDto[] = [];
    @Input() possibleValues: PossibleValuesHolder[] = [];
    itemData: BaseItemModel[] | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private utilsService: UtilsService,
    ) {}

    ngOnInit() {
        if (this.currentCollection && this.itemId && this.collectionFields.length > 0) {
            this.createDynamicForm();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ngOnChanges(changes: SimpleChanges): void {
        // if (
        //     changes['currentCollection'] &&
        //     changes['currentCollection'].previousValue.id !==
        //         changes['currentCollection'].currentValue.id
        // ) {
        //     this.createDynamicForm();
        // }
        if (this.currentCollection && this.itemId && this.collectionFields.length > 0) {
            this.createDynamicForm();
        }
    }

    createDynamicForm(): void {
        this.form = this.formBuilder.group({
            fields: this.formBuilder.array(
                this.collectionFields.map((f) => this.createControl(f.type!, f.id!, f.isRequired!)),
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
            initialValue = this.utilsService.getImageUrl(this.currentCollection!.id!, '');
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
        const field = this.collectionFields[fieldIdx];
        if (!field) return [];
        if (field.type != 10) return [];
        const fieldPossibleValues = this.possibleValues.find((e) => e.fieldId === field.id);
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

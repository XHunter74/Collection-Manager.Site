import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FieldTypeDto } from '../../../models/field-type.dto';
import { CollectionsService } from '../../../services/collections.service';
import { CollectionFieldDto } from '../../../models/collection-field.dto';
import { MatTableDataSource } from '@angular/material/table';
import { EditCollectionFieldModel } from '../../../models/edit-collection-field.model';
import { EditCollectionFieldComponent } from '../edit-collection-field/edit-collection-field.component';
import { MatDialog } from '@angular/material/dialog';
import { EditPossibleValuesComponent } from '../edit-possible-values/edit-possible-values.component';
import { PossibleValueDto } from '../../../models/possible-value.dto';
import { FieldTypes } from '../../../models/field-types.enum';

@Component({
    selector: 'app-fields-list',
    templateUrl: './fields-list.component.html',
    styleUrl: './fields-list.component.css',
    standalone: false,
})
export class FieldsListComponent implements OnChanges, OnInit {
    @Input() collectionId: string | null = null;
    fieldTypes = FieldTypes;
    fieldTypes1: FieldTypeDto[] = [];
    fields: CollectionFieldDto[] = [];
    sortedData = new MatTableDataSource<CollectionFieldDto>();
    displayedColumns: string[] = ['name', 'description', 'isRequired', 'typeName', 'buttons'];

    constructor(
        private matDialog: MatDialog,
        private collectionService: CollectionsService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['collectionId']) {
            console.log('Collection ID changed:', this.collectionId);

            this.loadCollectionFields();
        }
    }

    ngOnInit(): void {}

    addCollectionField(): void {
        const data = new EditCollectionFieldModel();
        data.fieldTypes = this.fieldTypes1;

        EditCollectionFieldComponent.show(this.matDialog, undefined, data).subscribe({
            next: (updatedField: CollectionFieldDto) => {
                if (updatedField) {
                    const maxOrder = Math.max(...this.fields.map((f) => f.order ?? 0));
                    updatedField.order = maxOrder + 1;
                    this.createCollectionField(updatedField);
                }
            },
            error: (err) => {
                console.error('Error updating field:', err);
            },
        });
    }

    loadCollectionFields(): void {
        if (!this.collectionId) {
            console.warn('No collection ID provided.');
            return;
        }
        this.collectionService.loadCollectionFields(this.collectionId).subscribe({
            next: (fields) => {
                this.fields = fields
                    .map((field) => {
                        const fieldTypeStr = `FIELD_TYPES.${(FieldTypes[field.type!] as string).toUpperCase()}`;
                        field.typeName = fieldTypeStr;
                        if (field.isSystem) {
                            field.name = `SYSTEM_COLUMNS.${field.name?.toUpperCase()}`;
                        }
                        return {
                            ...field,
                            typeName: fieldTypeStr ? fieldTypeStr : 'Unknown',
                        };
                    })
                    .sort((a, b) => a.order! - b.order!);
                this.sortedData.data = this.fields;
                console.log('Collection fields loaded:', this.fields);
            },
            error: (err) => {
                console.error('Error loading collection fields:', err);
            },
        });
    }

    deleteCollectionField(fieldId: string): void {
        if (!fieldId) {
            console.warn('No field ID provided for deletion.');
            return;
        }

        this.collectionService.deleteCollectionField(fieldId).subscribe({
            next: () => {
                console.log('Field deleted successfully:', fieldId);
                this.fields = this.fields.filter((f) => f.id !== fieldId);
                this.sortedData.data = [...this.fields];
            },
            error: (err) => {
                console.error('Error deleting field:', err);
            },
        });
    }

    editCollectionField(fieldId: string): void {
        const field = this.fields.find((f) => f.id === fieldId);
        if (!field) {
            console.warn('Field not found:', fieldId);
            return;
        }

        const data = new EditCollectionFieldModel();
        data.field = field;
        data.fieldTypes = this.fieldTypes1;

        EditCollectionFieldComponent.show(this.matDialog, undefined, data).subscribe({
            next: (updatedField: CollectionFieldDto) => {
                if (updatedField) {
                    this.updateCollectionField(updatedField);
                }
            },
            error: (err) => {
                console.error('Error updating field:', err);
            },
        });
    }

    createCollectionField(field: CollectionFieldDto): void {
        this.collectionService.createCollectionField(this.collectionId!, field).subscribe({
            next: (createdField: CollectionFieldDto) => {
                console.log('Field created successfully:', createdField);
                createdField.typeName = this.fieldTypes1.find(
                    (ft) => ft.value === createdField.type,
                )?.name;
                this.fields.push(createdField);
                this.fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                this.sortedData.data = [...this.fields];
            },
            error: (err: any) => {
                console.error('Error creating field:', err);
            },
        });
    }

    updateCollectionField(field: CollectionFieldDto): void {
        this.collectionService.updateCollectionField(field).subscribe({
            next: (updatedField: CollectionFieldDto) => {
                updatedField.typeName = this.fieldTypes1.find(
                    (ft) => ft.value === updatedField.type,
                )?.name;
                console.log('Field updated successfully:', updatedField);
                const index = this.fields.findIndex((f) => f.id === updatedField.id);
                if (index !== -1) {
                    this.fields[index] = updatedField;
                    this.sortedData.data = [...this.fields];
                }
            },
            error: (err: any) => {
                console.error('Error updating field:', err);
            },
        });
    }

    changeOrder(fieldId: string, direction: number): void {
        const field = this.fields.find((f) => f.id === fieldId);
        if (!field) {
            console.warn('Field not found:', fieldId);
            return;
        }

        const currentOrder = field.order!;

        let pairField: CollectionFieldDto | undefined;

        while (!pairField) {
            pairField = this.fields.find(
                (f) => f.order === currentOrder + direction && f.id !== fieldId,
            );
        }

        const newOrder = currentOrder + direction;

        if (newOrder < 0) {
            console.warn('New order is out of bounds:', newOrder);
            return;
        }

        field.order = newOrder;
        pairField.order = pairField.order! - direction;

        this.fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.sortedData.data = this.fields;
        this.storeChangedOrder(field.id!, field.order!);
        this.storeChangedOrder(pairField.id!, pairField.order!);
    }

    isUpButtonDisabled(fieldId: string): boolean {
        const minOrder = Math.min(...this.fields.map((f) => f.order ?? 0));
        const order = this.fields.find((f) => f.id === fieldId)!.order;
        return order! <= minOrder;
    }

    isDownButtonDisabled(fieldId: string): boolean {
        const maxOrder = Math.max(...this.fields.map((f) => f.order ?? 0));
        const order = this.fields.find((f) => f.id === fieldId)!.order;
        return order! >= maxOrder;
    }

    storeChangedOrder(fieldId: string, order: number): void {
        this.collectionService.changeCollectionFieldOrder(fieldId, order).subscribe({
            next: () => {
                console.log(`Order for field ${fieldId} updated to ${order}`);
            },
            error: (err) => {
                console.error(`Error updating order for field ${fieldId}:`, err);
            },
        });
    }

    editPossibleValues(fieldId: string): void {
        this.collectionService.loadPossibleValues(fieldId).subscribe({
            next: (possibleValues) => {
                console.log('Possible values loaded for field:', fieldId, possibleValues);
                const possibleValuesClone = possibleValues.map((v) => ({ ...v }));
                EditPossibleValuesComponent.show(
                    this.matDialog,
                    undefined,
                    possibleValuesClone,
                ).subscribe({
                    next: (updatedValues) => {
                        if (updatedValues) {
                            console.log('Updated possible values:', updatedValues);
                            this.processPossibleValuesChange(
                                fieldId,
                                possibleValues,
                                updatedValues,
                            );
                        }
                    },
                    error: (err) => {
                        console.error('Error updating possible values:', err);
                    },
                });
            },
            error: (err) => {
                console.error('Error loading possible values for field:', err);
            },
        });
    }

    processPossibleValuesChange(
        fieldId: string,
        originalValues: PossibleValueDto[],
        updatedValues: PossibleValueDto[],
    ): void {
        const addedValues = updatedValues.filter(
            (v) => !originalValues.some((ov) => ov.id === v.id),
        );
        const removedValues = originalValues.filter(
            (v) => !updatedValues.some((uv) => uv.id === v.id),
        );
        const updatedValuesList = updatedValues.filter((v) =>
            originalValues.some((ov) => ov.id === v.id && ov.value !== v.value),
        );

        for (const value of addedValues) {
            this.collectionService.createPossibleValue(fieldId, value.value).subscribe({
                next: (createdValue) => {
                    console.log('Added possible value:', createdValue);
                },
                error: (err) => {
                    console.error('Error adding possible value:', err);
                },
            });
        }

        for (const value of removedValues) {
            this.collectionService.deletePossibleValue(value.id).subscribe({
                next: () => {
                    console.log('Removed possible value:', value);
                },
                error: (err) => {
                    console.error('Error removing possible value:', err);
                },
            });
        }

        for (const value of updatedValuesList) {
            this.collectionService.updatePossibleValue(value.id, value.value).subscribe({
                next: (updatedValue) => {
                    console.log('Updated possible value:', updatedValue);
                },
                error: (err) => {
                    console.error('Error updating possible value:', err);
                },
            });
        }
    }
}

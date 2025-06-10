import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FieldTypeDto } from '../../models/field-type.dto';
import { CollectionsService } from '../../services/collections.service';
import { CollectionFieldDto } from '../../models/collection-field.dto';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-fields-list',
    templateUrl: './fields-list.component.html',
    styleUrl: './fields-list.component.css',
    standalone: false,
})
export class FieldsListComponent implements OnChanges, OnInit {
    @Input() collectionId: string | null = null;
    fieldTypes: FieldTypeDto[] = [];
    fields: CollectionFieldDto[] = [];
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = ['name', 'description', 'typeName', 'buttons']; //'description', 'typeName',

    constructor(private collectionService: CollectionsService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['collectionId']) {
            console.log('Collection ID changed:', this.collectionId);
            this.loadCollectionFields();
        }
    }

    ngOnInit(): void {
        this.loadFieldTypes();
    }

    loadFieldTypes() {
        this.collectionService.loadFieldTypes().subscribe({
            next: (fieldTypes: FieldTypeDto[]) => {
                this.fieldTypes = fieldTypes;
                console.log('Field types loaded:', this.fieldTypes);
            },
            error: (err) => {
                console.error('Error loading field types:', err);
            },
        });
    }

    addCollectionField(): void {}

    loadCollectionFields(): void {
        if (!this.collectionId) {
            console.warn('No collection ID provided.');
            return;
        }
        this.collectionService.loadCollectionFields(this.collectionId).subscribe({
            next: (fields) => {
                this.fields = fields
                    .map((field) => {
                        const fieldType = this.fieldTypes.find((ft) => ft.value === field.type);
                        return {
                            ...field,
                            typeName: fieldType ? fieldType.name : 'Unknown',
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

    deleteCollectionField(fieldId: string): void {}

    editCollectionField(fieldId: string): void {}

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
}

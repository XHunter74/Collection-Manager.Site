import { Component, Input, OnChanges } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';
import { CollectionsService } from '../../services/collections.service';
import { CollectionFieldDto } from '../../models/collection-field.dto';
import { PossibleValuesHolder } from '../../models/possible-values.holder';

@Component({
    selector: 'app-items',
    templateUrl: './items-panel.component.html',
    styleUrl: './items-panel.component.css',
    standalone: false,
})
export class ItemsPanelComponent implements OnChanges {
    @Input() currentCollection: CollectionDto | null = null;
    selectedItemId: string | null = null;
    collectionFields: CollectionFieldDto[] = [];
    possibleValues: PossibleValuesHolder[] = [];

    constructor(private collectionService: CollectionsService) {}

    ngOnChanges(): void {
        this.loadCollectionFields();
    }

    loadCollectionFields(): void {
        if (this.currentCollection) {
            this.collectionService.loadCollectionFields(this.currentCollection.id!).subscribe({
                next: (fields) => {
                    console.log('Collection fields loaded:', fields);
                    this.collectionFields = fields.sort((a, b) => a.order! - b.order!);
                    this.possibleValues = [];
                    for (const field of this.collectionFields.filter((f) => f.type === 10)) {
                        this.loadPossibleValues(field.id!);
                    }
                },
                error: (err) => {
                    console.error('Error loading collection fields:', err);
                },
            });
        } else {
            console.log('No current collection selected.');
        }
    }

    loadPossibleValues(fieldId: string): void {
        this.collectionService.loadPossibleValues(fieldId).subscribe({
            next: (values) => {
                this.possibleValues.push(new PossibleValuesHolder(fieldId, values));
            },
            error: (err) => {
                console.error('Error loading possible values for field:', fieldId, err);
            },
        });
    }
}

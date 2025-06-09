import { Component, Input, OnChanges } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';
import { CollectionsService } from '../../services/collections.service';
import { CollectionFieldDto } from '../../models/collection-field.dto';
import { BaseItemModel } from '../../models/base-item.model';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrl: './items.component.css',
    standalone: false,
})
export class ItemsComponent implements OnChanges {
    @Input() currentCollection: CollectionDto | null = null;
    fields: CollectionFieldDto[] = [];
    items: BaseItemModel[] = [];

    constructor(private collectionsService: CollectionsService) {}

    ngOnChanges(): void {
        this.handleCollectionChange();
    }

    private handleCollectionChange(): void {
        if (this.currentCollection) {
            console.log('Current collection changed:', this.currentCollection);
            this.processCollectionChange();
        }
    }

    private processCollectionChange(): void {
        if (!this.currentCollection || !this.currentCollection.id) {
            console.warn('No current collection or collection id found.');
            return;
        }

        this.collectionsService.loadCollectionFields(this.currentCollection.id).subscribe({
            next: (fields: CollectionFieldDto[]) => {
                this.fields = fields;
                this.loadItemsForCurrentCollection();
            },
            error: (err) => {
                console.error('Error loading collection fields:', err);
            },
        });
    }

    private loadItemsForCurrentCollection(): void {
        if (!this.currentCollection || !this.currentCollection.id) {
            return;
        }
        this.collectionsService.loadCollectionItems(this.currentCollection.id).subscribe({
            next: (items: BaseItemModel[]) => {
                console.log('Items loaded for collection:', this.currentCollection?.name, items);
                this.items = items;
            },
            error: (err) => {
                console.error('Error loading items for collection:', err);
            },
        });
    }
}

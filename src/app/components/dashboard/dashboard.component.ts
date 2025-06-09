import { Component, Input } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';
import { MatDialog } from '@angular/material/dialog';
import { EditCollectionComponent } from '../edit-collection/edit-collection.component';
import { CollectionsService } from '../../services/collections.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: false,
})
export class DashboardComponent {
    @Input() currentCollection: CollectionDto | null = null;

    constructor(
        private matDialog: MatDialog,
        private collectionsService: CollectionsService,
    ) {}

    clickEditCollection(): void {
        const data = new CollectionDto();
        data.id = this.currentCollection?.id;
        data.name = this.currentCollection?.name;
        data.description = this.currentCollection?.description;
        EditCollectionComponent.show(this.matDialog, undefined, data).subscribe({
            next: (collection: CollectionDto) => {
                if (collection) {
                    console.log('Updated collection:', collection);
                }
            },
            error: (err) => {
                console.error('Error updating user name:', err);
            },
        });
    }

    processCollectionChange(updatedCollection: CollectionDto): void {
        if (updatedCollection.id) {
            this.collectionsService.updateCollection(updatedCollection).subscribe({
                next: (collection: CollectionDto) => {
                    console.log('Collection updated successfully:', collection);
                    this.currentCollection = collection;
                },
                error: (err) => {
                    console.error('Error updating collection:', err);
                },
            });
        } else {
            // If the collection ID is not set, it means a new collection is being created
        }
    }
}

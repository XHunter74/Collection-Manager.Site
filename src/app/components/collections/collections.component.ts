import { Component, Input } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';
import { CollectionsService } from '../../services/collections.service';
import { Router } from '@angular/router';
import { Constants } from '../../shared/constants';

@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html',
    styleUrl: './collections.component.css',
    standalone: false,
})
export class CollectionsComponent {
    @Input() currentCollection: CollectionDto | null = null;

    constructor(
        private collectionsService: CollectionsService,
        private router: Router,
    ) {}

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

    manageCollections(): void {
        this.router.navigateByUrl(Constants.ManageCollectionsUrl);
    }
}

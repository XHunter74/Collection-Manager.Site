import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CollectionsService } from '../../services/collections.service';
import { CollectionDto } from '../../models/collection.dto';

@Component({
    selector: 'app-select-collection',
    templateUrl: './select-collection.component.html',
    styleUrl: './select-collection.component.css',
    standalone: false,
})
export class SelectCollectionComponent implements OnInit {
    collections: CollectionDto[] = [];
    @Output() currentCollectionChange = new EventEmitter<CollectionDto | null>();
    currentCollectionId: string | null = null;

    constructor(private collectionsService: CollectionsService) {}

    ngOnInit(): void {
        const currentCollectionId = localStorage.getItem('current_collection_id');
        this.collectionsService.loadCollections().subscribe({
            next: (collections: CollectionDto[]) => {
                console.log('Collections loaded:', collections);
                this.collections = collections;
                if (currentCollectionId) {
                    this.currentCollectionId = currentCollectionId;
                    const currentCollection = collections.find(
                        (collection) => collection.id === currentCollectionId,
                    );
                    this.currentCollectionChange.emit(currentCollection ?? null);
                } else {
                    this.currentCollectionChange.emit(null);
                }
            },
            error: (err) => {
                console.error('Error loading collections:', err);
            },
        });
    }

    onCollectionChange(event: any): void {
        const currentCollection =
            this.collections.find((collection) => collection.id === event.value) ?? null;
        localStorage.setItem('current_collection_id', currentCollection?.id ?? '');
        this.currentCollectionChange.emit(currentCollection);
    }
}

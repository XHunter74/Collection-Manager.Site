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
        this.collectionsService.loadCollections().subscribe({
            next: (collections: CollectionDto[]) => {
                console.log('Collections loaded:', collections);
                this.collections = collections;
            },
            error: (err) => {
                console.error('Error loading collections:', err);
            },
        });
    }

    onCollectionChange(event: any): void {
        const currentCollection =
            this.collections.find((collection) => collection.id === event.value) ?? null;
        this.currentCollectionChange.emit(currentCollection);
    }
}

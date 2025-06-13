import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionsService } from '../../../services/collections.service';
import { CollectionDto } from '../../../models/collection.dto';

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

    constructor(
        private collectionsService: CollectionsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            let collectionIdFromUrl = params.get('collectionId');
            if (!collectionIdFromUrl) {
                collectionIdFromUrl = localStorage.getItem('current_collection_id');
                if (collectionIdFromUrl) {
                    this.router.navigate([], {
                        queryParams: { collectionId: collectionIdFromUrl },
                        queryParamsHandling: 'merge',
                    });
                }
            }
            this.loadCollections(collectionIdFromUrl);
        });
    }

    loadCollections(currentCollectionId?: string | null): void {
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
        if (currentCollection?.id) {
            this.router.navigate([], {
                queryParams: { collectionId: currentCollection.id },
                queryParamsHandling: 'merge',
            });
            localStorage.setItem('current_collection_id', currentCollection.id);
        } else {
            this.router.navigate([], {
                queryParams: { collectionId: null },
                queryParamsHandling: 'merge',
            });
            localStorage.removeItem('current_collection_id');
        }
        this.currentCollectionChange.emit(currentCollection);
    }
}

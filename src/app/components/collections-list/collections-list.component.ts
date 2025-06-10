import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionsService } from '../../services/collections.service';
import { CollectionDto } from '../../models/collection.dto';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditCollectionComponent } from '../edit-collection/edit-collection.component';

@Component({
    selector: 'app-collections-list',
    templateUrl: './collections-list.component.html',
    styleUrl: './collections-list.component.css',
    standalone: false,
})
export class CollectionsListComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = ['name', 'buttons'];
    collections: CollectionDto[] = [];

    constructor(
        private matDialog: MatDialog,
        private collectionsService: CollectionsService,
    ) {}

    ngOnInit(): void {
        this.collectionsService.loadCollections().subscribe({
            next: (collections) => {
                this.sortedData.data = collections;
                this.collections = collections;
            },
            error: (err) => {
                console.error('Error loading collections:', err);
            },
        });
    }

    public addCollection(): void {
        EditCollectionComponent.show(this.matDialog, undefined).subscribe({
            next: (collection: CollectionDto) => {
                if (collection) {
                    this.collectionsService.createCollection(collection).subscribe({
                        next: (newCollection: CollectionDto) => {
                            console.log('New collection created:', newCollection);
                            this.collections.push(newCollection);
                            this.sortedData.data = [...this.collections];
                        },
                        error: (err) => {
                            console.error('Error creating collection:', err);
                        },
                    });
                }
            },
            error: (err) => {
                console.error('Error creating collection:', err);
            },
        });
    }

    public deleteCollection(collectionId: string): void {
        if (collectionId) {
            // Confirm deletion with the user
        }
    }

    public editCollection(collectionId: string): void {
        const collection = this.collections.find((c) => c.id === collectionId);
        const data = new CollectionDto();
        data.id = collection?.id;
        data.name = collection?.name;
        data.description = collection?.description;
        EditCollectionComponent.show(this.matDialog, undefined, data).subscribe({
            next: (collection: CollectionDto) => {
                if (collection) {
                    this.collectionsService.updateCollection(collection).subscribe({
                        next: (updatedCollection: CollectionDto) => {
                            console.log('Updated collection:', updatedCollection);
                            const index = this.collections.findIndex(
                                (c) => c.id === updatedCollection.id,
                            );
                            if (index !== -1) {
                                this.collections[index] = updatedCollection;
                                this.sortedData.data = [...this.collections];
                            }
                        },
                        error: (err) => {
                            console.error('Error updating collection:', err);
                        },
                    });
                }
            },
            error: (err) => {
                console.error('Error updating user name:', err);
            },
        });
    }
}

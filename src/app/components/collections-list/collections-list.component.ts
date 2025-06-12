import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CollectionsService } from '../../services/collections.service';
import { CollectionDto } from '../../models/collection.dto';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditCollectionComponent } from '../edit-collection/edit-collection.component';
import { QuestionDialogComponent } from '../dialogs/question-dialog.component';
import { Constants } from '../../shared/constants';

@Component({
    selector: 'app-collections-list',
    templateUrl: './collections-list.component.html',
    styleUrl: './collections-list.component.css',
    standalone: false,
})
export class CollectionsListComponent implements OnInit {
    @Output() selectedCollectionIdChange = new EventEmitter<string | null>();
    @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = ['name', 'buttons'];
    collections: CollectionDto[] = [];
    selectedCollectionId: string | null = null;

    constructor(
        private matDialog: MatDialog,
        private collectionsService: CollectionsService,
    ) {}

    ngOnInit(): void {
        let collectionIdFromUrl: string | null = null;
        const urlParams = new URLSearchParams(window.location.search);
        collectionIdFromUrl = urlParams.get('collectionId');
        const storedId = localStorage.getItem('selectedCollectionId');
        const idToUse = collectionIdFromUrl || storedId;
        if (!collectionIdFromUrl && storedId) {
            // If not in URL, update URL for consistency
            const url = new URL(window.location.href);
            url.searchParams.set('collectionId', storedId);
            window.history.replaceState({}, '', url.toString());
        }
        this.selectedCollectionId = idToUse ? idToUse : null;
        if (this.selectedCollectionId) {
            this.selectedCollectionIdChange.emit(this.selectedCollectionId);
        }

        this.collectionsService.loadCollections().subscribe({
            next: (collections) => {
                this.sortedData.data = collections;
                this.collections = collections;
                if (
                    this.selectedCollectionId &&
                    !this.collections.some((c) => c.id === this.selectedCollectionId)
                ) {
                    this.selectedCollectionId = null;
                    localStorage.removeItem('selectedCollectionId');
                }
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
            QuestionDialogComponent.show(
                this.matDialog,
                'EDIT_COLLECTION.DELETE_CONFIRMATION',
            ).subscribe({
                next: (result) => {
                    if (result && result === Constants.Positive) {
                        console.log('Deleting collection with ID:', collectionId);
                        this.collectionsService.deleteCollection(collectionId).subscribe({
                            next: () => {
                                console.log('Collection deleted successfully');
                                this.collections = this.collections.filter(
                                    (c) => c.id !== collectionId,
                                );
                                this.sortedData.data = [...this.collections];
                                if (this.selectedCollectionId === collectionId) {
                                    this.selectedCollectionId = null;
                                    this.selectedCollectionIdChange.emit(this.selectedCollectionId);
                                }
                            },
                            error: (err: any) => {
                                console.error('Error deleting collection:', err);
                            },
                        });
                    }
                },
                error: (err) => {
                    console.error('Error showing delete confirmation dialog:', err);
                },
            });
        }
    }

    public editCollection(collectionId: string): void {
        const collection = this.collections.find((c) => c.id === collectionId);
        const data = new CollectionDto();
        data.id = collection?.id;
        data.name = collection?.name;
        data.description = collection?.description;
        data.image = collection?.image || undefined;
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

    public selectRow(collection: CollectionDto): void {
        this.selectedCollectionId = collection.id ?? null;
        if (this.selectedCollectionId) {
            localStorage.setItem('selectedCollectionId', this.selectedCollectionId);
            const url = new URL(window.location.href);
            url.searchParams.set('collectionId', this.selectedCollectionId);
            window.history.replaceState({}, '', url.toString());
        } else {
            localStorage.removeItem('selectedCollectionId');
            const url = new URL(window.location.href);
            url.searchParams.delete('collectionId');
            window.history.replaceState({}, '', url.toString());
        }
        this.selectedCollectionIdChange.emit(this.selectedCollectionId);
        console.log('Selected collection:', collection);
    }
}

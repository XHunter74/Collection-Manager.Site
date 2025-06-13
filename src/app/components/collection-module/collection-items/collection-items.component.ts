import { Component, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { CollectionDto } from '../../../models/collection.dto';
import { CollectionsService } from '../../../services/collections.service';
import { CollectionFieldDto } from '../../../models/collection-field.dto';
import { BaseItemModel } from '../../../models/base-item.model';
import { MatTableDataSource } from '@angular/material/table';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-collection-items',
    templateUrl: './collection-items.component.html',
    styleUrl: './collection-items.component.css',
    standalone: false,
})
export class CollectionItemsComponent implements OnInit, OnChanges {
    @Input() currentCollection: CollectionDto | null = null;
    fields: CollectionFieldDto[] = [];
    sortedData = new MatTableDataSource<BaseItemModel>();
    displayedColumns = ['displayName'];
    @Output() selectedItemIdChange = new EventEmitter<string | null>();
    selectedItemId: string | null = null;

    ngOnInit(): void {
        this.restoreSelectedItem();
    }

    restoreSelectedItem() {
        const key = this.getStorageKey();
        const stored = localStorage.getItem(key);
        if (stored) {
            this.selectedItemId = stored;
            this.selectedItemIdChange.emit(this.selectedItemId);
        }
    }

    constructor(
        private matDialog: MatDialog,
        private collectionsService: CollectionsService,
    ) {}

    ngOnChanges(): void {
        this.handleCollectionChange();
    }

    private handleCollectionChange(): void {
        if (this.currentCollection) {
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
        this.collectionsService
            .loadCollectionItemsWithNameField(this.currentCollection.id)
            .subscribe({
                next: (items: BaseItemModel[]) => {
                    console.log(
                        'Items loaded for collection:',
                        this.currentCollection?.name,
                        items,
                    );
                    this.sortedData.data = items;
                    this.restoreSelectedItem();
                },
                error: (err) => {
                    console.error('Error loading items for collection:', err);
                },
            });
    }

    addNewItem(): void {
        DynamicFormComponent.show(this.matDialog).subscribe({
            next: (newItem: any) => {
                if (newItem) {
                    console.log('New item created:', newItem);
                    this.sortedData.data = [...this.sortedData.data, newItem];
                    this.selectRow(newItem);
                }
            },
            error: (err) => {
                console.error('Error creating new item:', err);
            },
        });
    }

    public selectRow(item: BaseItemModel): void {
        this.selectedItemId = item.id ?? null;
        localStorage.setItem(this.getStorageKey(), this.selectedItemId ?? '');
        this.selectedItemIdChange.emit(this.selectedItemId);
    }

    private getStorageKey(): string {
        return this.currentCollection && this.currentCollection.id
            ? `selectedItemId_${this.currentCollection.id}`
            : 'selectedItemId';
    }
}

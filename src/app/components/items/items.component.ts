import { Component, Input, OnChanges } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrl: './items.component.css',
    standalone: false,
})
export class ItemsComponent implements OnChanges {
    @Input() currentCollection: CollectionDto | null = null;

    ngOnChanges(): void {
        this.handleCollectionChange();
    }

    private handleCollectionChange(): void {
        if (this.currentCollection) {
            console.log('Current collection changed:', this.currentCollection);
        }
    }
}

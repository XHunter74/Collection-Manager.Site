import { Component, Input } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';

@Component({
    selector: 'app-item-component',
    templateUrl: './item.component.html',
    styleUrl: './item.component.css',
    standalone: false,
})
export class ItemComponent {
    @Input() currentCollection: CollectionDto | null = null;
    @Input() itemId: string | null = null;
}

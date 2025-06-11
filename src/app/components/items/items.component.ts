import { Component, Input } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrl: './items.component.css',
    standalone: false,
})
export class ItemsComponent {
    @Input() currentCollection: CollectionDto | null = null;

    constructor() {}
}

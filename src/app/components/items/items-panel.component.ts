import { Component, Input } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';

@Component({
    selector: 'app-items',
    templateUrl: './items-panel.component.html',
    styleUrl: './items-panel.component.css',
    standalone: false,
})
export class ItemsPanelComponent {
    @Input() currentCollection: CollectionDto | null = null;
    selectedItemId: string | null = null;

    constructor() {}
}

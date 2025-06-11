import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-item-component',
    templateUrl: './item.component.html',
    styleUrl: './item.component.css',
    standalone: false,
})
export class ItemComponent {
    @Input() itemId: string | null = null;
}

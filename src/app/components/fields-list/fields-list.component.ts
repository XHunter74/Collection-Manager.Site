import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-fields-list',
    templateUrl: './fields-list.component.html',
    styleUrl: './fields-list.component.css',
    standalone: false,
})
export class FieldsListComponent {
    @Input() collectionId: string | null = null;
}

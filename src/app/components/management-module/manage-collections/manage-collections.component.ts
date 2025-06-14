import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-manage-collections',
    templateUrl: './manage-collections.component.html',
    styleUrl: './manage-collections.component.css',
    standalone: false,
})
export class ManageCollectionsComponent {
    @Input() collectionId: string | null = null;
}

import { Component, Input } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';
import { MatDialog } from '@angular/material/dialog';
import { EditCollectionComponent } from '../edit-collection/edit-collection.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: false,
})
export class DashboardComponent {
    @Input() currentCollection: CollectionDto | null = null;

    constructor(private matDialog: MatDialog) {}

    clickEditCollection(): void {
        EditCollectionComponent.show(this.matDialog).subscribe({
            next: (userName: string | null) => {
                if (userName) {
                    localStorage.setItem('user_name', userName);
                    console.log('User name updated:', userName);
                } else {
                    console.warn('No user name provided.');
                }
            },
            error: (err) => {
                console.error('Error updating user name:', err);
            },
        });
    }
}

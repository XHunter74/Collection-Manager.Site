import { Component } from '@angular/core';
import { CollectionDto } from '../../models/collection.dto';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: false,
})
export class DashboardComponent {
    currentCollection: CollectionDto | null = null;
}

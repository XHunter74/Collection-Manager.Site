import { Component } from '@angular/core';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrl: './test.component.css',
    standalone: false,
})
export class TestComponent {
    imageId: string | null = '09388e75-1e44-4ad8-9740-46d32af83052';

    onImageIdChanged(newId: string | null) {
        this.imageId = newId;
        console.log(`Image ID changed: ${this.imageId}`);
    }
}

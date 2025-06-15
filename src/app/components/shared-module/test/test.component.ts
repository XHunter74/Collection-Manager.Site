import { Component } from '@angular/core';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrl: './test.component.css',
    standalone: false,
})
export class TestComponent {
    imageId: string | null = '09388e75-1e44-4ad8-9740-46d32af83052';
    images: string[] = [
        '09388e75-1e44-4ad8-9740-46d32af83052',
        '8394d7b2-0e5b-4d6f-a49f-64b9d551e0fa',
    ];

    onImageIdChanged(newId: string | null) {
        this.imageId = newId;
        console.log(`Image ID changed: ${this.imageId}`);
    }

    onImagesChanged(newImages: string[]) {
        this.images = newImages;
        console.log(`Images changed: ${this.images}`);
    }
}

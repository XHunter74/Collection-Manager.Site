import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsListComponent } from '../../../src/app/components/collections-list/collections-list.component';

describe('CollectionsListComponent', () => {
    let component: CollectionsListComponent;
    let fixture: ComponentFixture<CollectionsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CollectionsListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CollectionsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

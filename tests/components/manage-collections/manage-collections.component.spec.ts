import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCollectionsComponent } from '../../../src/app/components/management-module/manage-collections/manage-collections.component';

describe('ManageCollectionsComponent', () => {
    let component: ManageCollectionsComponent;
    let fixture: ComponentFixture<ManageCollectionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ManageCollectionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ManageCollectionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

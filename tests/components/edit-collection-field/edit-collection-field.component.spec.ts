import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionFieldComponent } from '../../../src/app/components/edit-collection-field/edit-collection-field.component';

describe('EditCollectionFieldComponent', () => {
    let component: EditCollectionFieldComponent;
    let fixture: ComponentFixture<EditCollectionFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditCollectionFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditCollectionFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

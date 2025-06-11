import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPossibleValuesComponent } from '../../../src/app/components/edit-possible-values/edit-possible-values.component';

describe('EditPossibleValuesComponent', () => {
    let component: EditPossibleValuesComponent;
    let fixture: ComponentFixture<EditPossibleValuesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditPossibleValuesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditPossibleValuesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

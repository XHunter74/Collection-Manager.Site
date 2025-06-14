import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCollectionComponent } from '../../../src/app/components/collection-module/select-collection/select-collection.component';

describe('SelectCollectionComponent', () => {
    let component: SelectCollectionComponent;
    let fixture: ComponentFixture<SelectCollectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectCollectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectCollectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponentComponent } from '../../../src/app/components/collection-module/item/item.component';

describe('ItemComponentComponent', () => {
    let component: ItemComponentComponent;
    let fixture: ComponentFixture<ItemComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemComponentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

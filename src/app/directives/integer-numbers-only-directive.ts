import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: 'input[appIntegerNumberOnly]',
    standalone: false,
})
export class IntegerNumbersOnlyDirective {
    // Allow integer numbers, positive and negative
    private regex: RegExp = new RegExp(/^-?\d*$/g);
    // Allow key codes for special events: Backspace, tab, end, home, arrows, delete
    private specialKeys: Array<string> = [
        'Backspace',
        'Tab',
        'End',
        'Home',
        'ArrowLeft',
        'ArrowRight',
        'Del',
        'Delete',
    ];

    constructor(private el: ElementRef) {}

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        const next: string = [current.slice(0, position), event.key, current.slice(position)].join(
            '',
        );
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }

    @HostListener('input', ['$event'])
    onInput() {
        const current: string = this.el.nativeElement.value;
        if (current && !String(current).match(this.regex)) {
            this.el.nativeElement.value = current.replace(/[^\d-]/g, '');
        }
    }
}

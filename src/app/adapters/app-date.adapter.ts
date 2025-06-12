import { MomentDateAdapter } from '@angular/material-moment-adapter';

export class AppDateAdapter extends MomentDateAdapter {
    override getFirstDayOfWeek(): number {
        return 1;
    }
}

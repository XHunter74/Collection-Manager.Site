
import { AfterViewInit, Component } from '@angular/core';
import { LoginModalComponent } from './login-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(private matDialog: MatDialog) { }


  ngAfterViewInit(): void {
    LoginModalComponent.show(this.matDialog);
  }
}

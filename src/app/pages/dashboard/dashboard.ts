import { Component } from '@angular/core';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { UsersWidgetComponent } from '../../shared/widgets/usersWidget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SpinnerComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}

import { Component } from '@angular/core';
import { SpinnerComponent } from '../../shared/components/spinner';

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

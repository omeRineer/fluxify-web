import { Component } from '@angular/core';
import { SpinnerComponent } from '../../shared/components/spinner';

@Component({
  selector: 'app-dashboard',
  imports: [
    SpinnerComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}

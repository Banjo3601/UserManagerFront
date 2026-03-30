import { Component } from '@angular/core';
import { UsersPageComponent } from './features/users/pages/users-page/users-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UsersPageComponent],
  templateUrl: './app.html'
})
export class AppComponent {}
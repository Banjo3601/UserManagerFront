import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
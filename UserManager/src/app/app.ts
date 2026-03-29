import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from './models/user.model';
import { UserService } from './Core/services/user.services';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { UserFormComponent } from './features/users/components/user-form/user-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserListComponent,
    UserFormComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isEditing = false;

  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  totalCount = 0;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const normalizedSearch = (this.searchTerm ?? '').trim();

    if (normalizedSearch) {
      this.userService.searchUsers(normalizedSearch, this.currentPage, this.pageSize).subscribe({
        next: (result) => {
          this.users = result.data;
          this.totalCount = result.totalCount;
          this.cdr.markForCheck();
        },
        error: (err) => console.error(err)
      });
      return;
    }

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.totalCount = data.length;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.users = data.slice(start, end);
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  onSave(user: User): void {
    if (this.isEditing) {
      this.userService.updateUser(user).subscribe({
        next: () => {
          this.cancelEdit();
          this.loadUsers();
        },
        error: (err) => console.error(err)
      });
      return;
    }

    this.userService.createUser(user).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => console.error(err)
    });
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.isEditing = false;
  }

  deleteUser(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error(err)
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }
}
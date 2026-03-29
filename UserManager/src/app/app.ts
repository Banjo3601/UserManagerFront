import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.services';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  totalCount = 0;
  isEditing = false;

  formUser: User = this.getEmptyUser();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  getEmptyUser(): User {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
  }

  loadUsers(): void {
    if (this.searchTerm.trim()) {
      this.userService.searchUsers(this.searchTerm, this.currentPage, this.pageSize).subscribe({
        next: (result) => {
          this.users = result.data;
          this.totalCount = result.totalCount;
          this.cdr.markForCheck();
        },
        error: (err) => console.error(err)
      });
    } else {
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

  submitForm(): void {
    if (this.isEditing) {
      this.userService.updateUser(this.formUser).subscribe({
        next: () => {
          this.cancelEdit();
          this.loadUsers();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.userService.createUser(this.formUser).subscribe({
        next: () => {
          this.formUser = this.getEmptyUser();
          this.loadUsers();
        },
        error: (err) => console.error(err)
      });
    }
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.formUser = { ...user };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.formUser = this.getEmptyUser();
  }

  deleteUser(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => console.error(err)
    });
  }

  nextPage(): void {
    const totalPages = this.totalPages;
    if (this.currentPage < totalPages) {
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
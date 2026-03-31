import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../../../models/user.model';
import { UserService } from '../../../../core/services/user.services';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';

import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent, UserListComponent, UserDetailComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isEditing = false;

  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  totalCount = 0;
  formResetTrigger = 0;
  successMessage = '';
  selectedDetailUser: User | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
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

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  onSave(user: User): void {
  if (this.isEditing) {
    const confirmed = confirm("Confirmer la modification de cet utilisateur ?");
    if (!confirmed) return;

    this.userService.updateUser(user).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur modifié avec succès.';
        this.cancelEdit();
        this.formResetTrigger++;
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => console.error(err)
    });

    return;
  }

  const confirmed = confirm("Créer cet utilisateur ?");
  if (!confirmed) return;

  this.userService.createUser(user).subscribe({
    next: () => {
      this.successMessage = 'Utilisateur créé avec succès.';
      this.formResetTrigger++;
      this.loadUsers();
      setTimeout(() => this.successMessage = '', 3000);
    },
    error: (err) => console.error(err)
  });
}

  onEdit(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.isEditing = false;
    this.formResetTrigger++;
  }

  onDelete(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error(err)
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onView(user: User): void {
    console.log('DETAIL USER', user);
    this.selectedDetailUser = user;
  }

  closeDetail(): void {
  this.selectedDetailUser = null;
  }
}
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  @Input() users: User[] = [];

  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<User>();

  onView(user: User): void {
    console.log('CLICK DETAIL CHILD', user);
    this.viewDetails.emit(user);
  }

  onEdit(user: User): void {
    this.edit.emit(user);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }
}
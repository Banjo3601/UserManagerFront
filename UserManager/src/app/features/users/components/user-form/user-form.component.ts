import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnChanges {
  @Input() user: User | null = null;
  @Input() isEditing = false;
  @Input() resetTrigger = 0;

  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  formUser: User = this.getEmptyUser();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      console.log('User input changed:', changes['user'].currentValue);
      this.formUser = this.user ? { ...this.user } : this.getEmptyUser();
    }

    if (changes['resetTrigger']) {
      this.formUser = this.user ? { ...this.user } : this.getEmptyUser();
    }
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

  submitForm(): void {
    this.save.emit(this.formUser);
  }

  onCancel(): void {
    this.formUser = this.getEmptyUser();
    this.cancel.emit();
  }
}
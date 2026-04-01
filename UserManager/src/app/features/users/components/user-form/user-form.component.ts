import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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

  @ViewChild('form') form!: NgForm;

  formUser: User = this.getEmptyUser();
  showPassword = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.formUser = this.user ? { ...this.user } : this.getEmptyUser();

      if (this.form) {
        this.form.resetForm(this.formUser);
      }
    }

    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.formUser = this.user ? { ...this.user } : this.getEmptyUser();

      if (this.form) {
        this.form.resetForm(this.formUser);
      }
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
    if (this.form.invalid) {
      this.form.control.markAllAsTouched();
      return;
    }

    this.save.emit(this.formUser);
  }

  onCancel(): void {
    this.formUser = this.getEmptyUser();

    if (this.form) {
      this.form.resetForm(this.formUser);
    }

    this.cancel.emit();
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent {
  @Input() email: string = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<UserData>();
  
  isLoading = false;
  error: string | null = null;
  readonly PASSWORD = 'Password123!'; // Hardcoded password

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.isLoading = true;
    this.submit.emit({
      email: this.email,
      password: this.PASSWORD
    });
  }
}

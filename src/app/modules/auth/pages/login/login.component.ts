import { Component, ViewChild, TemplateRef, ViewContainerRef, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { CreateUserDialogComponent } from '../../components/create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  error: string = '';
  isLoading = false;
  
  private dialogRef: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private viewContainerRef: ViewContainerRef
  ) {}

  onSubmit() {
    if (!this.email) {
      this.error = 'Por favor ingresa tu correo';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Por favor ingresa un correo válido';
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    // Directly attempt login
    const password = 'Password123!'; // In a real app, collect this from a password field
    this.handleLogin(password);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleLogin(password: string): void {
    this.authService.login(this.email, password)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.status === 404) {
            this.openCreateAccountDialog();
          } else {
            this.error = 'Error de inicio de sesión. Verifica tus credenciales.';
          }
        }
      });
  }

  private openCreateAccountDialog(): void {
    // Create component dynamically
    const componentRef = this.viewContainerRef.createComponent(CreateUserDialogComponent);
    componentRef.instance.email = this.email;
    
    // Handle dialog close
    const subscription = componentRef.instance.cancel.subscribe(() => {
      this.closeDialog(componentRef);
    });

    // Handle confirmation
    componentRef.instance.submit.subscribe((userData) => {
      this.isLoading = true;
      // Prepare registration data
      const registrationData = {
        email: userData.email,
        password: userData.password
      };
      
      this.authService.register(registrationData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            this.closeDialog(componentRef);
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Registration error:', error);
            componentRef.instance.error = 'Error al crear la cuenta. Por favor inténtalo de nuevo.';
          }
        });
    });

    // Store reference to close later
    this.dialogRef = { componentRef, subscription };
  }

  private closeDialog(componentRef: ComponentRef<CreateUserDialogComponent>): void {
    if (this.dialogRef) {
      this.dialogRef.subscription.unsubscribe();
      componentRef.destroy();
      this.dialogRef = null;
    }
  }

}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }
  
  // Check if user data is available
  const user = authService.getCurrentUser();
  if (!user) {
    authService.logout();
    return router.createUrlTree(['/login']);
  }

  return true;
};

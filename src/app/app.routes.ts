import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./modules/tasks/pages/task-list/task-list.component').then(
        (m) => m.TaskListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/tasks',
  },
];

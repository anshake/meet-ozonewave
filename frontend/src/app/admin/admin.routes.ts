import {Routes} from '@angular/router';
import {AdminShellComponent} from './admin-shell.component';
import {authGuard} from './auth.guard';

// Vector Store Console (admin) — sidebar shell with three routed pages, gated by authGuard.
export const ADMIN_ROUTES: Routes = [
  {path: 'login', loadComponent: () => import('./pages/login.component').then(m => m.AdminLoginComponent)},
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [authGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'test'},
      {path: 'test', loadComponent: () => import('./pages/test.component').then(m => m.AdminTestComponent)},
      {path: 'embeddings', loadComponent: () => import('./pages/list.component').then(m => m.AdminListComponent)},
      {path: 'embeddings/new', loadComponent: () => import('./pages/add.component').then(m => m.AdminAddComponent)},
      {path: '**', redirectTo: 'test'},
    ],
  },
];

import {Routes} from '@angular/router';
import {AdminShellComponent} from './admin-shell.component';

// Vector Store Console (admin) — sidebar shell with three routed pages.
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'test'},
      {path: 'test', loadComponent: () => import('./pages/test.component').then(m => m.AdminTestComponent)},
      {path: 'embeddings', loadComponent: () => import('./pages/list.component').then(m => m.AdminListComponent)},
      {path: 'embeddings/new', loadComponent: () => import('./pages/add.component').then(m => m.AdminAddComponent)},
      {path: '**', redirectTo: 'test'},
    ],
  },
];

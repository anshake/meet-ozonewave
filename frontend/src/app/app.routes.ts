import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)},
];

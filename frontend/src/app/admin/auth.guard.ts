import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {map} from 'rxjs';
import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const toLogin = () => router.createUrlTree(['/admin/login'], {queryParams: {returnUrl: state.url}});

  if (auth.isAuthenticated()) {
    return true;
  }
  return auth.check().pipe(map(ok => ok || toLogin()));
};

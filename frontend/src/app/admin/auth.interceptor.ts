import {inject} from '@angular/core';
import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {AuthService} from './auth.service';

// A 401 on a protected admin call means the session expired mid-use: clear local
// auth state and bounce to the login page. The on-load session check (/api/auth/me)
// is left to authGuard, and the login POST surfaces its own 401 to the form.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (req.url.startsWith('/api/admin') && err.status === 401) {
        auth.clear();
        router.navigate(['/admin/login'], {queryParams: {returnUrl: router.url}});
      }
      return throwError(() => err);
    }),
  );
};

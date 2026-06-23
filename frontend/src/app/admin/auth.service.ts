import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

// Mirrors the backend com.shake.ow.api.AuthController.AuthenticatedUser.
export interface AuthenticatedUser {
  username: string;
}

// Session-based auth for the single-owner admin. Login/logout are handled by the
// Spring Security filter chain (/api/auth/login, /api/auth/logout); the session
// lives in the JSESSIONID cookie, so there is no token to store here.
@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);

  // null = unknown (not yet checked), otherwise the resolved auth state.
  readonly username = signal<string | null>(null);
  readonly isAuthenticated = signal(false);

  login(username: string, password: string): Observable<void> {
    const body = new HttpParams().set('username', username).set('password', password);
    return this.http.post('/api/auth/login', body, {responseType: 'text'}).pipe(
      tap(() => this.setAuthenticated(username)),
      map(() => undefined),
    );
  }

  logout(): Observable<void> {
    return this.http.post('/api/auth/logout', null, {responseType: 'text'}).pipe(
      finalize(() => this.clear()),
      map(() => undefined),
    );
  }

  // Verifies the session against the backend; resolves false on a 401.
  check(): Observable<boolean> {
    return this.http.get<AuthenticatedUser>('/api/auth/me').pipe(
      tap(user => this.setAuthenticated(user.username)),
      map(() => true),
      catchError(() => {
        this.clear();
        return of(false);
      }),
    );
  }

  clear(): void {
    this.username.set(null);
    this.isAuthenticated.set(false);
  }

  private setAuthenticated(username: string): void {
    this.username.set(username);
    this.isAuthenticated.set(true);
  }
}

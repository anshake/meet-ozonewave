import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

// Owner login for the Vector Store Console. Posts to the Spring Security form-login
// endpoint; on success routes to the originally requested page (or the test page).
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})
export class AdminLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly username = signal('');
  readonly password = signal('');
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    const user = this.username().trim();
    if (!user || !this.password() || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.login(user, this.password()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin/test';
        this.router.navigateByUrl(returnUrl);
      },
      error: err => {
        this.submitting.set(false);
        this.error.set(err.status === 401 ? 'Invalid username or password.' : 'Could not sign in. Try again.');
      },
    });
  }
}

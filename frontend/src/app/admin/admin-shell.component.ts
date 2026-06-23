import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from './auth.service';

// App shell for the Vector Store Console — sidebar (stays mounted) + routed pages.
// Styled with the main site's Tailwind tokens (no dedicated stylesheet).
@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly username = this.auth.username;

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login']),
    });
  }
}

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {IconComponent} from './shared/icon.component';

// App shell for the Vector Store Console — sidebar (stays mounted) + routed pages.
// Styled with the main site's Tailwind tokens (no dedicated stylesheet).
@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
}

import {Component, inject, signal} from '@angular/core';
import {CalendlyService} from '../../services/calendly.service';

const CALENDLY_URL = 'https://calendly.com/anshake/30min';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html'
})
export class NavComponent {
  private readonly calendly = inject(CalendlyService);

  readonly loading = signal(false);

  bookMeeting(): void {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);
    this.calendly.open(CALENDLY_URL).finally(() => this.loading.set(false));
  }
}

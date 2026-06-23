import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CalendlyService} from '../../services/calendly.service';

const CALENDLY_URL = 'https://calendly.com/anshake/30min';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  private readonly calendly = inject(CalendlyService);

  bookMeeting(): void {
    this.calendly.open(CALENDLY_URL);
  }
}

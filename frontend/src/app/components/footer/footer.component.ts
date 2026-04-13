import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  readonly revealed = signal(false);

  private readonly mailUser = 'info';
  private readonly mailDomain = 'ozonewave.com';

  get mailHref(): string { return `mailto:${this.mailUser}@${this.mailDomain}`; }
  get mailLabel(): string { return `${this.mailUser}@${this.mailDomain}`; }

  reveal(): void { this.revealed.set(true); }
}

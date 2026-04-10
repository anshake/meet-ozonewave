import { Component } from '@angular/core';
import { TerminalComponent } from '../terminal/terminal.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TerminalComponent],
  templateUrl: './hero.component.html'
})
export class HeroComponent {}

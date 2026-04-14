import {Component} from '@angular/core';
import {NavComponent} from '../../components/nav/nav.component';
import {HeroComponent} from '../../components/hero/hero.component';
import {ProjectsComponent} from '../../components/projects/projects.component';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, HeroComponent, ProjectsComponent, FooterComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
}

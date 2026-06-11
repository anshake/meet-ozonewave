import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ContentTypeId, ctLabel, isDated} from '../kb-data';
import {IconComponent} from '../shared/icon.component';
import {CtSelectComponent} from '../shared/ct-select.component';
import {SkillsEditorComponent} from '../shared/skills-editor.component';

// Add embedding — form that builds the JSON document with a live preview of
// exactly what gets embedded. No backend yet, so submit just returns to the list.
@Component({
  selector: 'app-admin-add',
  standalone: true,
  imports: [RouterLink, IconComponent, CtSelectComponent, SkillsEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex-1 flex flex-col min-w-0'},
  templateUrl: './add.component.html',
})
export class AdminAddComponent {
  constructor(private router: Router) {}

  readonly contentPlaceholder =
    'Desired Roles\nAnton Pavlik is available for Senior Java Developer and Tech Lead engagements.\n\n' +
    'Looking for roles involving:\n- Back-end development with Java 21+ and the Spring ecosystem';

  readonly contentType = signal<ContentTypeId>('CONTACT_INFO');
  readonly content = signal('');
  readonly client = signal('');
  readonly startDate = signal('');
  readonly endDate = signal('');
  readonly skills = signal<string[]>([]);

  readonly ctLabel = ctLabel;
  readonly dated = computed(() => isDated(this.contentType()));

  readonly tokens = computed(() => Math.max(0, Math.round(this.content().trim().length / 4)));
  readonly valid = computed(() => this.content().trim().length > 0);

  cancel(): void {
    this.router.navigate(['/admin/embeddings']);
  }

  submit(): void {
    // No backend yet — once an embeddings API exists, POST the form fields then navigate.
    this.router.navigate(['/admin/embeddings']);
  }
}

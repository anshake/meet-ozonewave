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
  template: `
    <div class="h-[58px] shrink-0 border-b border-border flex items-center gap-3.5 px-6">
      <a class="inline-flex items-center gap-2 bg-transparent border border-border2 rounded-md px-3 py-2 text-body font-mono text-xs cursor-pointer hover:border-dim hover:text-text" routerLink="/admin/embeddings">
        <va-icon name="chev" [size]="12" class="rotate-180"/>Embeddings
      </a>
      <div class="flex-1"></div>
    </div>

    <div class="flex-1 flex min-h-0 max-lg:flex-col">
      <div class="flex-1 overflow-auto px-7 py-6 min-w-0">
        <div class="text-text text-[17px] font-semibold mb-1">New embedding</div>
        <div class="text-muted text-xs mb-[22px]">Fill the document fields — it's chunked, embedded with text-embedding-3-small,
          and added to <b class="text-body">profile_v3</b>.</div>

        <div class="mb-5 max-w-[680px]">
          <div class="field-label">Content type</div>
          <va-ct-select [value]="contentType()" (changed)="contentType.set($event)"/>
        </div>

        <div class="mb-5 max-w-[680px]">
          <div class="field-label"><span>Content</span><span class="text-muted">~{{ tokens() }} tokens</span></div>
          <textarea class="w-full bg-bg border border-border2 rounded-[10px] px-3.5 py-3.5 text-text font-mono text-[13px] leading-[1.7] min-h-[190px] whitespace-pre-wrap outline-none focus:border-amber focus:shadow-[0_0_0_3px_rgba(240,168,50,0.10)]"
                    [value]="content()" (input)="content.set($any($event.target).value)"
                    [placeholder]="contentPlaceholder"></textarea>
          <div class="text-muted text-[11px] mt-[7px]">This is the text the assistant retrieves and grounds answers in. First line reads well as a heading.</div>
        </div>

        <div class="mb-5 max-w-[680px]">
          <div class="field-label">Client / employer@if (!dated()) {<span class="text-muted">n/a for {{ ctLabel(contentType()) }}</span>}</div>
          <input [class]="!dated() ? 'input opacity-50' : 'input'" [value]="dated() ? client() : ''" [disabled]="!dated()"
                 [placeholder]="dated() ? 'e.g. Confidential (fintech)' : 'null'"
                 (input)="client.set($any($event.target).value)"/>
        </div>

        <div class="mb-5 max-w-[680px]">
          <div class="field-label">Date range@if (!dated()) {<span class="text-muted">n/a for {{ ctLabel(contentType()) }}</span>}</div>
          <div class="grid grid-cols-2 gap-3">
            <input type="month" [class]="!dated() ? 'input opacity-50' : 'input'" [disabled]="!dated()"
                   [value]="dated() ? startDate() : ''" (input)="startDate.set($any($event.target).value)"/>
            <input type="month" [class]="!dated() ? 'input opacity-50' : 'input'" [disabled]="!dated()"
                   [value]="dated() ? endDate() : ''" (input)="endDate.set($any($event.target).value)"/>
          </div>
          @if (dated()) {
            <div class="text-muted text-[11px] mt-[7px]">Leave the end date empty for a current / ongoing role.</div>
          }
        </div>

        <div class="mb-5 max-w-[680px]">
          <div class="field-label">Skills</div>
          <va-skills [skills]="skills()" (changed)="skills.set($event)"/>
        </div>

        <div class="flex gap-2.5 mt-2 max-w-[680px]">
          <button class="btn" (click)="cancel()">Cancel</button>
          <button class="btn-primary flex-1 justify-center" [disabled]="!valid()" (click)="submit()">
            <va-icon name="embed" [size]="13"/>Embed &amp; add to store
          </button>
        </div>
      </div>
    </div>
  `,
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

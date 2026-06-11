import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';

// Editable skill tags — add via Enter or blur (trimmed, de-duped), remove via ×.
@Component({
  selector: 'va-skills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-[7px] items-center">
      @for (s of skills(); track s) {
        <span class="inline-flex items-center gap-1.5 bg-amber/10 text-amber border border-amber/35 rounded-md pl-2.5 pr-1.5 py-1.5 text-xs">{{ s }}
          <button class="bg-transparent border-0 text-amber cursor-pointer text-sm leading-none px-0.5 opacity-65 hover:opacity-100" (click)="remove(s)">×</button>
        </span>
      }
      <input class="bg-bg border border-dashed border-border2 rounded-md px-2.5 py-1.5 text-text font-mono text-xs w-[90px] outline-none focus:border-amber focus:border-solid"
             [value]="draft()" placeholder="+ skill"
             (input)="draft.set($any($event.target).value)"
             (keydown.enter)="$event.preventDefault(); add()"
             (blur)="add()"/>
    </div>
  `,
})
export class SkillsEditorComponent {
  readonly skills = input.required<string[]>();
  readonly changed = output<string[]>();

  readonly draft = signal('');

  add(): void {
    const v = this.draft().trim();
    if (v && !this.skills().includes(v)) {
      this.changed.emit([...this.skills(), v]);
    }
    this.draft.set('');
  }

  remove(s: string): void {
    this.changed.emit(this.skills().filter(x => x !== s));
  }
}

import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';

// Editable skill tags — add via Enter or blur (trimmed, de-duped), remove via ×.
@Component({
  selector: 'va-skills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills-editor.component.html',
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

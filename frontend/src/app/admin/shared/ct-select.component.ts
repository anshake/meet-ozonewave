import {ChangeDetectionStrategy, Component, computed, input, output, signal} from '@angular/core';
import {CONTENT_TYPES, ContentTypeId} from '../kb-data';
import {IconComponent} from './icon.component';

// Custom content-type dropdown — trigger shows the mono enum key + human label.
@Component({
  selector: 'va-ct-select',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ct-select.component.html',
})
export class CtSelectComponent {
  readonly value = input.required<ContentTypeId>();
  readonly changed = output<ContentTypeId>();

  readonly types = CONTENT_TYPES;
  readonly open = signal(false);
  readonly current = computed(() =>
    CONTENT_TYPES.find(c => c.id === this.value()) ?? {label: this.value()});

  pick(id: ContentTypeId): void {
    this.changed.emit(id);
    this.open.set(false);
  }
}

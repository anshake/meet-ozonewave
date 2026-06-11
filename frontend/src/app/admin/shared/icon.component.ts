import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

// 1.4-stroke, round-cap line icons drawn from a path table (uses currentColor).
// Multi-segment paths are split on " M" so each subpath renders separately.
const PATHS: Record<string, string> = {
  test: 'M5.5 5l2.5 3-2.5 3 M10 11h3',
  list: 'M3 4h10 M3 8h10 M3 12h10 M0.6 4h.01 M0.6 8h.01 M0.6 12h.01',
  set: 'M8 10.2A2.2 2.2 0 1 0 8 5.8a2.2 2.2 0 0 0 0 4.4z M13 8c0-.5 0-.9-.1-1.3l1.4-1-1.5-2.6-1.6.6c-.6-.5-1.2-.8-1.9-1L9 1H6.8l-.3 1.7c-.7.2-1.3.5-1.9 1l-1.6-.6L1.5 5.7l1.4 1C2.8 7.1 2.8 7.5 2.8 8s0 .9.1 1.3l-1.4 1 1.5 2.6 1.6-.6c.6.5 1.2.8 1.9 1L6.8 15H9l.3-1.7c.7-.2 1.3-.5 1.9-1l1.6.6 1.5-2.6-1.4-1c.1-.4.1-.8.1-1.3z',
  embed: 'M8 1.5v13 M1.5 8h13 M3.5 3.5l9 9 M12.5 3.5l-9 9',
  search: 'M7 12.5A5.5 5.5 0 1 0 7 1.5a5.5 5.5 0 0 0 0 11z M14.5 14.5l-3.5-3.5',
  file: 'M4 1.5h5l3.5 3.5v9h-9z M9 1.5V5h3.5',
  trash: 'M2.5 4h11 M5.5 4V2.5h5V4 M4 4l.7 9.5h6.6L12 4 M6.5 6.5v5 M9.5 6.5v5',
  redo: 'M13 7a5 5 0 1 0-1.2 3.8 M13 3v4h-4',
  edit: 'M11 2.5l2.5 2.5L6 12.5 3 13l.5-3z M9.5 4l2.5 2.5',
  play: 'M5 3.5l7 4.5-7 4.5z',
  spark: 'M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6z',
  chev: 'M6 3.5l4.5 4.5L6 12.5',
  close: 'M3.5 3.5l9 9 M12.5 3.5l-9 9',
  plus: 'M8 3v10 M3 8h10',
  sliders: 'M3 5h6 M11 5h2 M3 11h2 M7 11h6 M9 3v4 M5 9v4',
  check: 'M3 8.5l3.5 3.5 6.5-8',
  dim: 'M8 4.2A3.8 3.8 0 1 0 8 11.8 3.8 3.8 0 0 0 8 4.2z',
  book: 'M3 2.5h7a2 2 0 0 1 2 2v9 M3 2.5v9 M3 11.5h7a2 2 0 0 1 2 2 M3 11.5a2 2 0 0 0-2 2',
};

@Component({
  selector: 'va-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(15);

  readonly segments = computed(() => {
    const d = PATHS[this.name()] ?? '';
    return d.split(' M').map((p, i) => (i ? 'M' : '') + p);
  });
}

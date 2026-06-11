import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Chunk, CONTENT_TYPES, ContentTypeId, ctLabel, isDated} from '../kb-data';
import {KbDataService} from '../kb-data.service';
import {IconComponent} from '../shared/icon.component';
import {CtSelectComponent} from '../shared/ct-select.component';
import {SkillsEditorComponent} from '../shared/skills-editor.component';

// amber is the primary accent, so status dots use distinct hues (teal/amber/red).
// const STATUS_COLOR: Record<ChunkStatus, string> = {indexed: '#6b82a8', pending: '#f0a832', stale: '#e07a5f'};

const ROW = 'grid grid-cols-[26px_1fr_140px] gap-3.5 items-center px-6 py-[13px] border-b border-border';
const CK = 'w-[15px] h-[15px] border rounded flex items-center justify-center cursor-pointer text-[#1a1205]';

// Embeddings list / manage — filterable list + edit/detail panel.
@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [RouterLink, IconComponent, CtSelectComponent, SkillsEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex-1 flex flex-col min-w-0'},
  templateUrl: './list.component.html',
})
export class AdminListComponent {
  readonly kb = inject(KbDataService);

  readonly row = ROW;
  readonly ck = CK;

  readonly filters: { id: ContentTypeId | 'all'; label: string }[] =
    [{id: 'all', label: 'All'}, ...CONTENT_TYPES.map(c => ({id: c.id, label: c.label}))];

  readonly panelWidth = signal(408);
  readonly ct = signal<ContentTypeId | 'all'>('all');
  readonly selId = signal<string | null>(this.kb.chunks()[0]?.id ?? null);
  readonly checked = signal<Set<string>>(new Set());

  readonly ctLabel = ctLabel;
  readonly isDated = isDated;
  // readonly statusColor = (s: ChunkStatus) => STATUS_COLOR[s];
  readonly emptySet = () => new Set<string>();

  readonly view = computed(() => {
    const f = this.ct();
    return this.kb.chunks().filter(c => f === 'all' || c.contentType === f);
  });
  readonly sel = computed(() => this.kb.chunks().find(c => c.id === this.selId()) ?? null);
  readonly allChecked = computed(() => {
    const v = this.view();
    return v.length > 0 && v.every(c => this.checked().has(c.id));
  });
  readonly checkedIds = computed(() => [...this.checked()]);

  count(id: ContentTypeId | 'all'): number {
    const cs = this.kb.chunks();
    return id === 'all' ? cs.length : cs.filter(c => c.contentType === id).length;
  }

  toggleCheck(id: string, e: Event): void {
    e.stopPropagation();
    this.checked.update(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  toggleAll(): void {
    const v = this.view();
    const all = this.allChecked();
    this.checked.update(s => {
      const n = new Set(s);
      v.forEach(c => all ? n.delete(c.id) : n.add(c.id));
      return n;
    });
  }

  onResizeStart(e: PointerEvent): void {
    e.preventDefault();
    const startX = e.clientX;
    const startW = this.panelWidth();
    const move = (ev: PointerEvent) => {
      // handle sits on the panel's left edge — dragging left widens it.
      this.panelWidth.set(Math.min(720, Math.max(320, startW + (startX - ev.clientX))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  reembed(ids: string[]): void {
    this.kb.reembed(ids);
  }

  remove(ids: string[]): void {
    this.kb.remove(ids);
    this.checked.update(s => {
      const n = new Set(s);
      ids.forEach(i => n.delete(i));
      return n;
    });
    if (this.selId() && ids.includes(this.selId()!)) {
      this.selId.set(null);
    }
  }

  commitContent(id: string, e: Event): void {
    const text = (e.target as HTMLElement).innerText;
    const cur = this.kb.chunks().find(c => c.id === id);
    if (cur && cur.content !== text) {
      this.kb.update(id, {content: text} as Partial<Chunk>);
    }
  }
}

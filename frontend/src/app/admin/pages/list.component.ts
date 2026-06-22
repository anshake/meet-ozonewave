import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {catchError, map, of, startWith} from 'rxjs';
import {AdminService} from '../admin.service';
import {
  CONTENT_TYPES,
  ContentTypeId,
  contentTypeLabel,
  ProfileDocumentDto,
  title,
} from '../profile-document.model';
import {fmtMonth} from '../kb-data';
import {IconComponent} from '../shared/icon.component';

const ROW = 'grid grid-cols-[1fr_140px] gap-3.5 items-center px-6 py-[13px] border-b border-border';

type LoadState =
  | {status: 'loading'}
  | {status: 'error'}
  | {status: 'ready'; docs: ProfileDocumentDto[]};

// Embeddings list — read-only view of the records in the vector store.
@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex-1 flex flex-col min-w-0'},
  templateUrl: './list.component.html',
})
export class AdminListComponent {
  private readonly admin = inject(AdminService);

  readonly row = ROW;
  readonly title = title;
  readonly contentTypeLabel = contentTypeLabel;
  readonly fmtMonth = fmtMonth;

  readonly filters: { id: ContentTypeId | 'all'; label: string }[] =
    [{id: 'all', label: 'All'}, ...CONTENT_TYPES.map(c => ({id: c.id, label: c.label}))];

  readonly panelWidth = signal(408);
  readonly ct = signal<ContentTypeId | 'all'>('all');
  readonly selId = signal<string | null>(null);

  private readonly state = toSignal(
    this.admin.getEntries().pipe(
      map(docs => ({status: 'ready', docs} as LoadState)),
      startWith({status: 'loading'} as LoadState),
      catchError(() => of({status: 'error'} as LoadState)),
    ),
    {initialValue: {status: 'loading'} as LoadState},
  );

  readonly loading = computed(() => this.state().status === 'loading');
  readonly error = computed(() => this.state().status === 'error');
  readonly docs = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? s.docs : [];
  });

  readonly view = computed(() => {
    const f = this.ct();
    return this.docs().filter(d => f === 'all' || d.metadata.contentType === f);
  });
  readonly sel = computed(() => this.docs().find(d => d.id === this.selId()) ?? null);

  count(id: ContentTypeId | 'all'): number {
    const ds = this.docs();
    return id === 'all' ? ds.length : ds.filter(d => d.metadata.contentType === id).length;
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
}

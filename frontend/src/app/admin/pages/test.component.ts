import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {AdminService} from '../admin.service';
import {contentTypeLabel} from '../profile-document.model';
import {RetrievalTestResponse} from '../retrieval-test.model';
import {IconComponent} from '../shared/icon.component';

// Test embeddings — drives the live assistant for a query and shows a trace of which entries each tool
// placed into the prompt (with cosine scores for the similarity branch), plus the model's real answer.
@Component({
  selector: 'app-admin-test',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex-1 flex flex-col min-w-0'},
  templateUrl: './test.component.html',
})
export class AdminTestComponent {
  private readonly admin = inject(AdminService);

  readonly contentTypeLabel = contentTypeLabel;

  readonly query = signal('');
  readonly running = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<RetrievalTestResponse | null>(null);

  readonly totalEntries = computed(() =>
    (this.result()?.toolCalls ?? []).reduce((sum, c) => sum + c.entries.length, 0));

  run(): void {
    const q = this.query().trim();
    if (!q || this.running()) {
      return;
    }
    this.running.set(true);
    this.error.set(null);
    this.result.set(null); // drop the previous run so its DOM is rebuilt, not reused
    this.admin.testEmbeddings(q).subscribe({
      next: res => {
        this.result.set(res);
        this.running.set(false);
      },
      error: () => {
        this.error.set('Request failed — check the backend is running.');
        this.running.set(false);
      },
    });
  }

  fmt(score: number): string {
    return score.toFixed(3);
  }

  firstLine(content: string): string {
    return content.split('\n').map(l => l.trim()).find(l => l.length > 0) ?? content;
  }

  snippet(content: string, n: number): string {
    return content.length > n ? content.slice(0, n).trim() + '…' : content;
  }
}

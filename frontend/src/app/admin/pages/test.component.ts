import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Chunk, ctLabel} from '../kb-data';
import {KbDataService} from '../kb-data.service';
import {IconComponent} from '../shared/icon.component';

interface RankedChunk extends Chunk {
  score: number;
  rank: number;
  inK: boolean;
  passT: boolean;
  inCtx: boolean;
}

interface AnswerPart {
  text: string;
  cite: number | null;
}

// Test embeddings — retrieval playground. Ranks chunks by stored cosine
// similarity for the active query, applies top-K + threshold cutoffs, and shows
// the synthesised answer with inline citations. Pure derivation (no fetch yet).
@Component({
  selector: 'app-admin-test',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex-1 flex flex-col min-w-0'},
  templateUrl: './test.component.html',
})
export class AdminTestComponent {
  private kb = inject(KbDataService);

  readonly queries = this.kb.queries;
  readonly qIdx = signal(0);
  readonly text = signal(this.kb.queries[0].q);
  readonly topK = signal(5);
  readonly threshold = signal(0.30);
  readonly scoreFmt = signal<'raw' | 'percent'>('raw');

  readonly ctLabel = ctLabel;
  readonly max = Math.max;
  readonly min = Math.min;

  readonly ranked = computed<RankedChunk[]>(() => {
    const q = this.queries[this.qIdx()];
    const k = this.topK();
    const th = this.threshold();
    return this.kb.chunks()
      .map(c => ({...c, score: q.scores[c.id] ?? 0}))
      .sort((a, b) => b.score - a.score)
      .map((c, i) => ({...c, rank: i, inK: i < k, passT: c.score >= th}))
      .map(c => ({...c, inCtx: c.inK && c.passT}));
  });

  readonly inCtx = computed(() => this.ranked().filter(c => c.inCtx));
  readonly ctxTokens = computed(() => this.inCtx().reduce((s, c) => s + c.tokens, 0));

  // citation number (1-based) for the first three in-context chunks
  private readonly citeIdx = computed(() => {
    const map = new Map<string, number>();
    this.inCtx().slice(0, 3).forEach((c, i) => map.set(c.id, i + 1));
    return map;
  });

  // answer split on sentence boundaries; cite markers appended after first N sentences
  readonly answerParts = computed<AnswerPart[]>(() => {
    const cites = this.inCtx().slice(0, 3);
    const parts = this.queries[this.qIdx()].answer.split(/(?<=\. )/);
    return parts.map((text, i) => ({text, cite: cites[i] ? i + 1 : null}));
  });

  fmt(v: number): string {
    return this.scoreFmt() === 'percent' ? Math.round(v * 100) + '%' : v.toFixed(2);
  }

  citeLabel(id: string): string {
    const n = this.citeIdx().get(id);
    return n ? `[${n}] ` : '';
  }

  cap(s: string, n: number): string {
    return s.length > n ? s.slice(0, n).trim() + '…' : s;
  }

  pick(i: number): void {
    this.qIdx.set(i);
    this.text.set(this.queries[i].q);
  }
}

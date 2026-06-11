import {Injectable, signal} from '@angular/core';
import {Chunk, CHUNKS, QUERIES, SavedQuery} from './kb-data';

// In-memory working store for the admin console (no backend yet).
// Holds the editable chunk set so edits/deletes persist across navigation.
// Replace these mutators with API calls once the vector-store endpoints exist.
@Injectable({providedIn: 'root'})
export class KbDataService {
  readonly chunks = signal<Chunk[]>(CHUNKS.map(c => ({...c, skills: [...c.skills]})));
  readonly queries: SavedQuery[] = QUERIES;

  /** Any field edit marks the chunk stale until it is re-embedded. */
  update(id: string, patch: Partial<Chunk>): void {
    this.chunks.update(cs => cs.map(c =>
      c.id === id ? {...c, ...patch, status: 'stale', updated: 'just now'} : c));
  }

  reembed(ids: string[]): void {
    this.chunks.update(cs => cs.map(c =>
      ids.includes(c.id) ? {...c, status: 'indexed', updated: 'just now'} : c));
  }

  remove(ids: string[]): void {
    this.chunks.update(cs => cs.filter(c => !ids.includes(c.id)));
  }
}

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ProfileDocumentDto} from './profile-document.model';
import {RetrievalTestResponse} from './retrieval-test.model';

// Mirrors the backend com.shake.ow.service.AdminService / AdminController.
@Injectable({providedIn: 'root'})
export class AdminService {
  private readonly http = inject(HttpClient);

  getEntries(): Observable<ProfileDocumentDto[]> {
    return this.http.get<ProfileDocumentDto[]>('/api/admin/entries')
               .pipe(map(docs => docs.map(AdminService.normalize)));
  }

  // Drives the live assistant for a query and returns the tool-call trace + answer.
  testEmbeddings(query: string): Observable<RetrievalTestResponse> {
    return this.http.post<RetrievalTestResponse>('/api/admin/test-embeddings', {query});
  }

  // Metadata keys are optional in the stored JSON — fill in the typed shape.
  private static normalize(doc: ProfileDocumentDto): ProfileDocumentDto {
    const m = doc.metadata ?? ({} as ProfileDocumentDto['metadata']);
    return {
      ...doc,
      metadata: {
        contentType: m.contentType,
        client: m.client ?? null,
        startDate: m.startDate ?? null,
        endDate: m.endDate ?? null,
        skills: m.skills ?? [],
      },
    };
  }
}

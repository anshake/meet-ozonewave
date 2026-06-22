import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ProfileDocumentDto} from './profile-document.model';

// Mirrors the backend com.shake.ow.service.AdminService / AdminController.
@Injectable({providedIn: 'root'})
export class AdminService {
  private readonly http = inject(HttpClient);

  getEntries(): Observable<ProfileDocumentDto[]> {
    return this.http.get<ProfileDocumentDto[]>('/api/admin/entries')
               .pipe(map(docs => docs.map(AdminService.normalize)));
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

// Real backend-backed types for the Embeddings list. Names mirror the backend
// (com.shake.ow.model.ProfileDocumentDto + the metadata written by IngestionService).
import {fmtMonth} from './kb-data';

export {fmtMonth};

// Mirrors com.shake.ow.ingest.ContentType.
export type ContentTypeId =
  | 'PROJECT'
  | 'EDUCATION'
  | 'CERTIFICATION'
  | 'CONTACT_INFO'
  | 'AVAILABILITY';

// Metadata written by IngestionService (DocumentDescriptor minus content).
export interface ProfileMetadata {
  contentType: ContentTypeId;
  client: string | null;
  startDate: string | null;
  endDate: string | null;
  skills: string[];
}

// Exact mirror of the backend ProfileDocumentDto record.
export interface ProfileDocumentDto {
  id: string;
  metadata: ProfileMetadata;
  content: string;
}

export interface ContentType {
  id: ContentTypeId;
  label: string;
}

export const CONTENT_TYPES: ContentType[] = [
  {id: 'PROJECT', label: 'Project'},
  {id: 'EDUCATION', label: 'Education'},
  {id: 'CERTIFICATION', label: 'Certification'},
  {id: 'CONTACT_INFO', label: 'Contact info'},
  {id: 'AVAILABILITY', label: 'Availability'},
];

export function contentTypeLabel(id: string): string {
  return CONTENT_TYPES.find(c => c.id === id)?.label ?? id;
}

/** Display title — first non-empty line of the embedded content. */
export function title(doc: ProfileDocumentDto): string {
  return doc.content.split('\n').map(l => l.trim()).find(l => l.length > 0) ?? doc.id;
}

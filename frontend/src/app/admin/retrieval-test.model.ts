// Mirrors com.shake.ow.model.RetrievalTestResponse (and its nested records).
import {ProfileMetadata} from './profile-document.model';

// Mirrors RetrievalTestResponse.TracedEntry — one entry a tool placed into the prompt.
// score is null for the non-embedding branches (exact client/contact/availability lookups);
// metadata is only present for the similarity-search branch.
// score / metadata are absent (not null) on the JSON for the non-embedding branches,
// since the backend omits null fields — hence optional here.
export interface TracedEntry {
  score?: number | null;
  content: string;
  metadata?: ProfileMetadata | null;
}

// Mirrors RetrievalTestResponse.ToolCall — one tool invocation the model made.
export interface ToolCall {
  tool: string;
  query: string | null;
  client: string | null;
  entries: TracedEntry[];
}

// Exact mirror of the backend RetrievalTestResponse record.
export interface RetrievalTestResponse {
  query: string;
  topK: number;
  similarityThreshold: number;
  answer: string;
  toolCalls: ToolCall[];
}

// Content-type vocabulary + small display helpers shared by the admin console
// (content-type selector, add form, month formatting).

export type ContentTypeId =
  | 'CONTACT_INFO'
  | 'WORK_EXPERIENCE'
  | 'PROJECT'
  | 'SKILL_SET'
  | 'EDUCATION'
  | 'SUMMARY';

export interface ContentType {
  id: ContentTypeId;
  label: string;
  count: number;
}

// contentType enum — id is what's stored/embedded, label is for display.
export const CONTENT_TYPES: ContentType[] = [
  {id: 'CONTACT_INFO', label: 'Contact info', count: 16},
  {id: 'WORK_EXPERIENCE', label: 'Work experience', count: 41},
  {id: 'PROJECT', label: 'Project', count: 29},
  {id: 'SKILL_SET', label: 'Skill set', count: 33},
  {id: 'EDUCATION', label: 'Education', count: 9},
  {id: 'SUMMARY', label: 'Summary', count: 14},
];

// contentTypes that carry client + date range; others store null.
export const DATED_TYPES: ContentTypeId[] = ['WORK_EXPERIENCE', 'PROJECT'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ctLabel(id: string): string {
  return CONTENT_TYPES.find(c => c.id === id)?.label ?? id;
}

export function isDated(id: string): boolean {
  return DATED_TYPES.includes(id as ContentTypeId);
}

export function fmtMonth(s: string | null): string | null {
  if (!s) return null;
  const [year, month] = String(s).split('-');
  return (MONTHS[parseInt(month, 10) - 1] || '') + ' ' + year;
}

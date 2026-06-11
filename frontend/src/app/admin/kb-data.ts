// Static fixture + types for the Vector Store Console (admin).
// Mirrors the JSON document shape that actually gets embedded:
//   { content, contentType, client, startDate, endDate, skills[] }
// plus admin-side metadata (id, title, tokens, status, updated).
// Swap KB_DATA for live API calls once a backend exists.

export type ContentTypeId =
  | 'CONTACT_INFO'
  | 'WORK_EXPERIENCE'
  | 'PROJECT'
  | 'SKILL_SET'
  | 'EDUCATION'
  | 'SUMMARY';

export type ChunkStatus = 'indexed' | 'pending' | 'stale';

export interface ContentType {
  id: ContentTypeId;
  label: string;
  count: number;
}

export interface Chunk {
  id: string;
  title: string;
  contentType: ContentTypeId;
  client: string | null;
  startDate: string | null;
  endDate: string | null;
  skills: string[];
  tokens: number;
  status: ChunkStatus;
  updated: string;
  content: string;
}

export interface SavedQuery {
  id: string;
  q: string;
  answer: string;
  scores: Record<string, number>;
}

export interface Collection {
  name: string;
  model: string;
  dims: number;
  metric: string;
  totalChunks: number;
  indexed: number;
  pending: number;
  stale: number;
  lastSync: string;
  sizeMB: number;
}

export const COLLECTION: Collection = {
  name: 'profile_v3',
  model: 'text-embedding-3-small',
  dims: 1536,
  metric: 'cosine',
  totalChunks: 142,
  indexed: 138,
  pending: 3,
  stale: 1,
  lastSync: '2h ago',
  sizeMB: 4.7,
};

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

export const CHUNKS: Chunk[] = [
  {
    id: 'chk_8f21a0', title: 'Lead Java Architect — Fintech', contentType: 'WORK_EXPERIENCE',
    client: 'Confidential (fintech)', startDate: '2019-01', endDate: '2023-06',
    skills: ['Java', 'Spring Cloud', 'Kafka', 'Micro-services', 'Software Architecture'],
    tokens: 214, status: 'indexed', updated: 'Apr 12',
    content: 'Lead Java Architect — Fintech\nLed the migration of a monolithic payments platform to an event-driven micro-services architecture on Spring Cloud and Kafka.\n\nHighlights:\n- Cut settlement latency ~60%\n- Enabled independent team deploys\n- Owned platform architecture and technical direction',
  },
  {
    id: 'chk_3c70d9', title: 'Senior Backend Engineer — Telecom', contentType: 'WORK_EXPERIENCE',
    client: 'Confidential (telecom)', startDate: '2016-03', endDate: '2019-01',
    skills: ['Java', 'Kafka Streams', 'PostgreSQL', 'Billing Systems'],
    tokens: 187, status: 'indexed', updated: 'Apr 12',
    content: 'Senior Backend Engineer — Telecom\nBuilt a real-time billing and rating pipeline processing ~4M events/day.\n\n- Kafka Streams + PostgreSQL\n- Owned SLAs, on-call, and capacity planning',
  },
  {
    id: 'chk_a14b62', title: 'Core stack — Java / Spring', contentType: 'SKILL_SET',
    client: null, startDate: null, endDate: null,
    skills: ['Java', 'Spring Boot', 'Hibernate', 'PostgreSQL', 'Kafka', 'Redis'],
    tokens: 96, status: 'indexed', updated: 'May 02',
    content: 'Core stack\n- Java 17/21, Spring Boot, Spring Cloud\n- Hibernate/JPA, PostgreSQL, Kafka, Redis\n- Domain modeling, transactional integrity, observability (OpenTelemetry, Grafana)',
  },
  {
    id: 'chk_d59e11', title: 'Full-stack reach', contentType: 'SKILL_SET',
    client: null, startDate: null, endDate: null,
    skills: ['TypeScript', 'React', 'Node.js', 'Tailwind'],
    tokens: 78, status: 'pending', updated: 'just now',
    content: 'Full-stack reach\nComfortable owning a feature end to end when needed.\n- TypeScript, React, Node, Tailwind\n- Schema, API, and UI without hand-offs',
  },
  {
    id: 'chk_2b88fc', title: 'Rail freight scheduling engine', contentType: 'PROJECT',
    client: 'National rail operator', startDate: '2021-04', endDate: '2022-11',
    skills: ['Java', 'Constraint Solver', 'Optimization', 'Scheduling'],
    tokens: 233, status: 'indexed', updated: 'Mar 28',
    content: 'Rail freight scheduling engine\nConstraint-based solver that optimizes freight slot allocation across a national rail network.\n- Rolling re-optimization\n- Reduced manual dispatch overrides',
  },
  {
    id: 'chk_91f4ad', title: 'RAG support assistant', contentType: 'PROJECT',
    client: 'Internal', startDate: '2023-09', endDate: '2024-02',
    skills: ['RAG', 'Vector Search', 'LLM', 'Python'],
    tokens: 201, status: 'indexed', updated: 'May 05',
    content: 'RAG support assistant\nRetrieval-augmented support assistant grounded in internal documentation.\n- Vector search over chunked docs with re-ranking\n- Measurable drop in first-line ticket volume',
  },
  {
    id: 'chk_77c0e3', title: 'Desired roles & availability', contentType: 'CONTACT_INFO',
    client: null, startDate: null, endDate: null,
    skills: ['Java', 'Spring Boot', 'REST API', 'Micro-services', 'Tech Lead', 'Software Architecture'],
    tokens: 64, status: 'stale', updated: 'Feb 09',
    content: 'Desired Roles\nAnton Pavlik is available for Senior Java Developer and Tech Lead engagements.\n\nLooking for roles involving:\n- Back-end development with Java 21+ and the Spring ecosystem (Spring Boot, Spring MVC, Spring Security, Spring JPA)\n- RESTful API design and micro-services architecture\n- Translating business requirements into technical solutions\n- Iterating quickly on product ideas and validating them with customers',
  },
  {
    id: 'chk_05ab9f', title: 'Education & continuous learning', contentType: 'EDUCATION',
    client: null, startDate: null, endDate: null,
    skills: ['Computer Science', 'LLM Tooling', 'Vector Search'],
    tokens: 71, status: 'indexed', updated: 'Jan 18',
    content: 'Education\nMSc Computer Science.\nContinuous learner — recent focus on LLM tooling, vector search, and applying AI where it earns its place.',
  },
  {
    id: 'chk_e3d271', title: 'Working style & summary', contentType: 'SUMMARY',
    client: null, startDate: null, endDate: null,
    skills: ['Remote', 'EU', 'Full-stack'],
    tokens: 58, status: 'indexed', updated: 'Jan 18',
    content: 'Summary\nBusiness-minded and detail-obsessed. Java and Spring at the core, full-stack when needed, AI where it makes sense.\nEU-based, open to remote.',
  },
];

// Saved test queries — chunk id -> cosine similarity, plus the synthesized answer.
export const QUERIES: SavedQuery[] = [
  {
    id: 'q1', q: 'What architecture work has Anton led?',
    answer: 'Anton has led senior architecture work — most notably as Lead Java Architect at a fintech firm (2019–2023), where he drove the migration of a monolithic payments platform to event-driven micro-services on Spring Cloud and Kafka, cutting settlement latency ~60%. Earlier, in telecoms, he built a real-time billing pipeline handling ~4M events/day.',
    scores: {chk_8f21a0: 0.91, chk_3c70d9: 0.78, chk_a14b62: 0.55, chk_2b88fc: 0.49, chk_91f4ad: 0.44, chk_d59e11: 0.33, chk_77c0e3: 0.29, chk_05ab9f: 0.22, chk_e3d271: 0.18},
  },
  {
    id: 'q2', q: 'Does he have experience with Kafka and event streaming?',
    answer: 'Yes. Kafka is part of Anton\'s core stack and he has applied it in production: an event-driven payments platform on Spring Cloud + Kafka, and a real-time billing/rating pipeline processing ~4M events/day with Kafka Streams.',
    scores: {chk_3c70d9: 0.88, chk_a14b62: 0.83, chk_8f21a0: 0.81, chk_d59e11: 0.41, chk_2b88fc: 0.38, chk_91f4ad: 0.31, chk_05ab9f: 0.20, chk_77c0e3: 0.17, chk_e3d271: 0.12},
  },
  {
    id: 'q3', q: 'What roles is Anton looking for?',
    answer: 'Anton is available for Senior Java Developer and Tech Lead engagements — back-end work with Java 21+ and the Spring ecosystem, RESTful API and micro-services design, and translating business requirements into technical solutions. He is EU-based and open to remote.',
    scores: {chk_77c0e3: 0.90, chk_e3d271: 0.62, chk_8f21a0: 0.40, chk_a14b62: 0.30, chk_3c70d9: 0.27, chk_05ab9f: 0.24, chk_2b88fc: 0.20, chk_91f4ad: 0.18, chk_d59e11: 0.12},
  },
];

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

export function fmtRange(a: string | null, b: string | null): string | null {
  const fa = fmtMonth(a);
  const fb = b ? fmtMonth(b) : 'Present';
  if (!fa) return null;
  return fa + ' — ' + fb;
}

import { Component } from '@angular/core';

interface Project {
  category: string;
  year: string;
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      category: 'CASE STUDY',
      year: '2024',
      title: 'Real-time data pipeline',
      description: 'Designed and built an event-driven ingestion platform processing 2M+ events/day for a fintech client.',
      tags: ['Kafka', 'Python', 'AWS'],
    },
    {
      category: 'CONSULTING',
      year: '2024',
      title: 'AI strategy roadmap',
      description: 'Led a 3-month engagement defining an AI adoption strategy for a 400-person logistics company.',
      tags: ['LLMs', 'Strategy', 'Roadmap'],
    },
    {
      category: 'ENGINEERING',
      year: '2023',
      title: 'Auth platform migration',
      description: 'Migrated a legacy monolith auth system to OAuth 2.0 with zero downtime across 180k users.',
      tags: ['OAuth', 'Node.js', 'Zero-downtime'],
    },
  ];
}

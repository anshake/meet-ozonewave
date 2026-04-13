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
      category: 'PET PROJECT',
      year: '2025',
      title: 'ViaDays',
      description: 'Visa-free stay tracker for frequent travellers. Users describe trips in plain language — AI handles the parsing and stay calculations.',
      tags: ['Java 25', 'Spring AI', 'Angular', 'PostgreSQL'],
    },
    {
      category: 'SR. JAVA DEVELOPER',
      year: '2022 – present',
      title: 'KPN — Network Configuration Platform',
      description: 'Maintaining applications that manage KPN\'s network configuration. Built REST APIs and a network browser; migrated 220K+ LOC from Java 11 to 21 and Spring Boot 2.7 to 3.4.',
      tags: ['Java 21', 'Spring Boot', 'Angular', 'Kafka', 'Neo4J'],
    },
    {
      category: 'LEAD JAVA DEVELOPER/ARCHITECT',
      year: '2021 – 2022',
      title: 'NS International — IRIS',
      description: 'Lead developer on ~10 microservices powering international trip booking and exchange across Europe, including SAP and ticketing platform integrations.',
      tags: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS', 'Microservices'],
    },
    {
      category: 'SR. BACKEND DEVELOPER',
      year: '2019 – 2021',
      title: 'LeasePlan — NGA Master Agreement',
      description: 'Backend development for a central repository managing customer products and agreements, built on a distributed microservices architecture.',
      tags: ['Java 11', 'Spring Boot', 'Auth0', 'Amazon SQS/SNS', 'PostgreSQL'],
    },
    {
      category: 'SR. BACKEND DEVELOPER',
      year: '2019',
      title: 'Backbase - Customer Experience Platform (CXP)',
      description: 'A set of micro-services to enable clients to create and manage end-user experiences.\n\nDay to day responsibilities: maintaining and testing existing functionality, new features implementation and testing.',
      tags: ['Spring', 'Spring Boot', 'REST', 'Maven', 'GitLab'],
    },
    {
      category: 'SR. BACKEND DEVELOPER',
      year: '2018',
      title: 'ING — Market Data API',
      description: 'Designed and implemented a REST API providing secure HTTP access to market and reference data for risk calculation under FRTB regulation.',
      tags: ['Java 8', 'Spring Boot', 'Spring Security', 'REST API'],
    },
  ];
}

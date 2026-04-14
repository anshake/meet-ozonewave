# Meet OzoneWave

My personal portfolio — but instead of a static page, you talk to it.

---

## What it is

**Meet OzoneWave** is a personal landing page with an AI-powered terminal that doesn't float over the page. It's part of it. You ask questions, the AI answers based on my actual career history, skills, and projects. Accurate by design. It only knows what I've put in.

Under the hood it uses RAG: profile data is stored in a vector database, and the AI retrieves relevant chunks before responding.

---

## What you can do

- **Focus the terminal** anytime with `⌘+/` on Mac or `Ctrl+/` on Linux/Windows
- **Ask anything** about my experience, skills, or projects — type in whatever language you prefer
- **Use slash commands** — type `/` to see available commands with autocomplete *(inspired by Claude Code)*
- **Switch the AI's tone** with `/tone`: choose from `professional`, `casual`, `monty-python`, `yoda`, or `consigliere`
- **Ask for contact info** with `/contact`
- The assistant **remembers context** within your session, so follow-up questions work naturally

---

## Tech stack

| Layer | Technology                      |
| --- |---------------------------------|
| Frontend | Angular 21, Tailwind CSS        |
| Backend | Java 25, Spring Boot 4          |
| AI | Spring AI + Anthropic Claude    |
| Embeddings | OpenAI `text-embedding-3-small` |
| Vector store | PostgreSQL + pgvector           |
| Database | PostgreSQL                      |
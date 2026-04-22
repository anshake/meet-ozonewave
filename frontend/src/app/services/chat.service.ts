import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ChatService {
  private conversationId = ChatService.loadOrCreateConversationId();

  private static loadOrCreateConversationId(): string {
    const match = document.cookie.match(/(?:^|; )conversationId=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const id = crypto.randomUUID();
    document.cookie = `conversationId=${id}; max-age=86400; path=/; SameSite=Strict`;
    return id;
  }

  get tone(): string {
    return document.cookie.split(';')
      .find(c => c.trim().startsWith('tone='))
      ?.split('=')[1] ?? '';
  }

  chat(message: string): Observable<string> {
    return from(this.streamChat(message));
  }

  private async* streamChat(message: string): AsyncGenerator<string> {
    const controller = new AbortController();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'ConversationId': this.conversationId,
          'X-Tone': this.tone,
        },
        body: message,
        signal: controller.signal,
      });
      if (!response.ok || !response.body) throw new Error(`Request failed: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) return;
        buffer += decoder.decode(value, {stream: true});
        const frames = buffer.split('\n\n');
        buffer = frames.pop() ?? '';
        for (const frame of frames) {
          const chunk = frame
            .split('\n')
            .filter(line => line.startsWith('data:'))
            .map(line => line.slice('data:'.length))
            .join('\n');
          if (chunk) yield chunk;
        }
      }
    } finally {
      controller.abort();
    }
  }
}

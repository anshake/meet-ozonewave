import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private conversationId = ChatService.loadOrCreateConversationId();

  private static loadOrCreateConversationId(): string {
    const match = document.cookie.match(/(?:^|; )conversationId=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const id = crypto.randomUUID();
    document.cookie = `conversationId=${id}; max-age=86400; path=/; SameSite=Strict`;
    return id;
  }

  chat(message: string): Observable<string> {
    return this.http.post('/api/chat', message, {
      headers: {
        'Content-Type': 'text/plain',
        'ConversationId': this.conversationId,
      },
      responseType: 'text',
    });
  }
}

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Command} from '../models/command.model';
import {ChatReply} from './chat.service';

@Injectable({providedIn: 'root'})
export class CommandsService {
  private readonly http = inject(HttpClient);
  private readonly conversationId = CommandsService.readConversationId();

  private static readConversationId(): string {
    const match = document.cookie.match(/(?:^|; )conversationId=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  getCommands(): Observable<Command[]> {
    return this.http.get<Command[]>('/api/commands');
  }

  execute(command: string, arg: string, tone: string): Observable<ChatReply> {
    return this.http.post<ChatReply>('/api/commands', {command, arg}, {
      headers: {
        'Content-Type': 'application/json',
        'ConversationId': this.conversationId,
        'X-Tone': tone,
      }
    });
  }
}

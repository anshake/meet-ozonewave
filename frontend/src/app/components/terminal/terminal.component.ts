import {
  Component, signal, ViewChild, ElementRef,
  inject, afterNextRender
} from '@angular/core';
import { ChatService } from '../../services/chat.service';

interface Message { role: 'user' | 'assistant'; content: string; }

@Component({
  selector: 'app-terminal',
  standalone: true,
  templateUrl: './terminal.component.html'
})
export class TerminalComponent {
  @ViewChild('termInput')   termInput!:   ElementRef<HTMLTextAreaElement>;
  @ViewChild('termMirror')  termMirror!:  ElementRef<HTMLDivElement>;
  @ViewChild('inputWrap')   inputWrap!:   ElementRef<HTMLSpanElement>;
  @ViewChild('termHistory') termHistory!: ElementRef<HTMLDivElement>;

  private chatService = inject(ChatService);

  messages = signal<Message[]>([
    { role: 'user',      content: 'what do you specialise in?' },
    { role: 'assistant', content: 'Software engineering and strategy consulting. Distributed systems, AI integrations, cloud architecture, and technical leadership.' },
    { role: 'user',      content: 'what kind of clients do you work with?' },
    { role: 'assistant', content: 'Tech-forward companies from Series A startups to enterprise scale. They need someone who can think strategically and ship production code.' },
    { role: 'user',      content: 'are you available for a new project?' },
  ]);
  isThinking  = signal(true);
  placeholder = signal('ask me anything');

  cursorVisible = signal(false);
  cursorTop     = signal(0);
  cursorLeft    = signal(0);

  private blurTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => this.showCursor());
  }

  onFocus(): void {
    if (this.blurTimer) { clearTimeout(this.blurTimer); this.blurTimer = null; }
    this.cursorVisible.set(false);
    this.placeholder.set('ask me anything');
  }

  onBlur(): void {
    this.blurTimer = setTimeout(() => {
      this.placeholder.set('');
      this.showCursor();
    }, 120);
  }

  onInput(): void {
    const el = this.termInput.nativeElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const value = this.termInput.nativeElement.value.trim();
      if (!value) return;
      this.submitMessage(value);
    }
  }

  private submitMessage(value: string): void {
    this.messages.update(msgs => [...msgs, { role: 'user', content: value }]);
    this.termInput.nativeElement.value = '';
    this.termInput.nativeElement.style.height = 'auto';
    this.isThinking.set(true);
    this.scrollHistoryToBottom();

    this.chatService.chat(value).subscribe({
      next: (reply) => {
        this.isThinking.set(false);
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: reply }]);
        this.scrollHistoryToBottom();
      },
      error: () => {
        this.isThinking.set(false);
        this.messages.update(msgs => [
          ...msgs,
          { role: 'assistant', content: 'Something went wrong. Try again.' },
        ]);
      },
    });
  }

  private showCursor(): void {
    this.positionCursor();
    // Restart blink animation via forced reflow
    const el = this.idleCursorEl;
    if (el) {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    }
    this.cursorVisible.set(true);
  }

  private positionCursor(): void {
    const mirror  = this.termMirror.nativeElement;
    const wrap    = this.inputWrap.nativeElement;
    const text    = this.termInput.nativeElement.value;

    mirror.textContent = text || '\u200b';

    const wrapRect = wrap.getBoundingClientRect();
    const textNode = mirror.firstChild!;
    const range    = document.createRange();
    const len      = textNode.textContent!.length;
    range.setStart(textNode, Math.max(0, len - 1));
    range.setEnd(textNode, len);
    const charRect = range.getBoundingClientRect();

    const top  = charRect.bottom - wrapRect.top - 15;
    const left = text.length === 0 ? 0 : charRect.right - wrapRect.left;

    this.cursorTop.set(Math.max(0, top));
    this.cursorLeft.set(Math.max(0, left));
  }

  private get idleCursorEl(): HTMLElement | null {
    // Access the cursor span via the inputWrap's last child
    const wrap = this.inputWrap?.nativeElement;
    if (!wrap) return null;
    return wrap.querySelector<HTMLElement>('span[style*="display"]') ??
           wrap.lastElementChild as HTMLElement;
  }

  private scrollHistoryToBottom(): void {
    setTimeout(() => {
      const el = this.termHistory.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }
}

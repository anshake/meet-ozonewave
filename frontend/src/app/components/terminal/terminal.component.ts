import {afterNextRender, Component, ElementRef, HostListener, inject, Injector, signal, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ChatReply, ChatService} from '../../services/chat.service';
import {CommandsService} from '../../services/commands.service';
import {Command} from '../../models/command.model';

interface Message {
  role: 'user' | 'assistant';
  content: ChatReply;
  timestamp: Date;
  tone?: string;
}

interface MenuItem {
  label: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './terminal.component.html'
})
export class TerminalComponent {
  @ViewChild('termInput') termInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('termMirror') termMirror!: ElementRef<HTMLDivElement>;
  @ViewChild('inputWrap') inputWrap!: ElementRef<HTMLSpanElement>;
  @ViewChild('termHistory') termHistory!: ElementRef<HTMLDivElement>;

  private chatService = inject(ChatService);
  private commandsService = inject(CommandsService);
  private injector = inject(Injector);

  readonly suggestions = [
    'What\'s your tech stack?',
    'Tell me about your experience',
    'What projects have you shipped?',
    'Are you open to new work?',
  ];

  messages = signal<Message[]>([]);
  isThinking = signal(false);
  placeholder = signal('ask me anything');

  cursorVisible = signal(false);
  cursorTop = signal(0);
  cursorLeft = signal(0);

  commands = signal<Command[]>([]);
  showMenu = signal(false);
  menuItems = signal<MenuItem[]>([]);
  menuIndex = signal(0);

  readonly focusShortcut = navigator.userAgent.includes('Mac') ? '⌘+/' : 'ctrl+/';

  private blurTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      this.termInput.nativeElement.focus();
      this.commandsService.getCommands().subscribe({
        next: cmds => this.commands.set(cmds),
        error: err => console.error('Failed to load commands', err),
      });
    });
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (event.key === '/' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.termInput.nativeElement.focus();
    }
  }

  onFocus(): void {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
    this.cursorVisible.set(false);
    this.placeholder.set('ask me anything');
  }

  onBlur(): void {
    this.blurTimer = setTimeout(() => {
      this.placeholder.set('');
      this.showMenu.set(false);
      this.showCursor();
    }, 120);
  }

  onInput(): void {
    const el = this.termInput.nativeElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    this.updateMenu(el.value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.showMenu()) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.menuIndex.set((this.menuIndex() + 1) % this.menuItems().length);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.menuIndex.set((this.menuIndex() - 1 + this.menuItems().length) % this.menuItems().length);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        this.showMenu.set(false);
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        this.applyMenuSelection();
        return;
      }
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const value = this.termInput.nativeElement.value.trim();
      if (!value) return;
      this.submitMessage(value);
    }
  }

  updateMenu(value: string): void {
    if (!value.startsWith('/')) {
      this.showMenu.set(false);
      return;
    }

    const withoutSlash = value.slice(1);
    const spaceIndex = withoutSlash.indexOf(' ');

    if (spaceIndex === -1) {
      // No space yet — filter commands by prefix
      const prefix = withoutSlash.toLowerCase();
      const items: MenuItem[] = this.commands()
        .filter(c => c.command.startsWith(prefix))
        .map(c => ({label: '/' + c.command, value: '/' + c.command + ' ', description: c.description}));

      if (items.length === 0) {
        this.showMenu.set(false);
        return;
      }
      this.menuItems.set(items);
      this.menuIndex.set(0);
      this.showMenu.set(true);
    } else {
      // Space present — show parameter options if the command has params
      const cmdName = withoutSlash.slice(0, spaceIndex);
      const argPart = withoutSlash.slice(spaceIndex + 1);
      const cmd = this.commands().find(c => c.command === cmdName);

      if (!cmd || cmd.parameters.length === 0 || argPart.trim().length > 0) {
        this.showMenu.set(false);
        return;
      }

      const items: MenuItem[] = cmd.parameters.map(p => ({
        label: p.parameter,
        value: '/' + cmdName + ' ' + p.parameter,
        description: p.description,
      }));
      this.menuItems.set(items);
      this.menuIndex.set(0);
      this.showMenu.set(true);
    }
  }

  sendSuggestion(text: string): void {
    this.submitMessage(text);
  }

  applyMenuSelection(): void {
    const item = this.menuItems()[this.menuIndex()];
    const el = this.termInput.nativeElement;
    el.value = item.value;
    this.onInput();
    this.updateMenu(item.value);
    el.focus();
  }

  private submitMessage(value: string): void {
    if (value.startsWith('/')) {
      const [cmdPart, argPart = ''] = value.slice(1).split(' ');
      this.messages.update(msgs => [...msgs, {role: 'user', content: {message: value}, timestamp: new Date()}]);
      this.termInput.nativeElement.value = '';
      this.termInput.nativeElement.style.height = 'auto';
      this.showMenu.set(false);
      this.isThinking.set(true);
      this.scrollHistoryToBottom();

      this.commandsService.execute(cmdPart, argPart, this.chatService.tone).subscribe({
        next: reply => {
          this.isThinking.set(false);
          this.messages.update(msgs => [...msgs, {role: 'assistant', content: reply, timestamp: new Date(), tone: this.chatService.tone || undefined}]);
          this.scrollToStartOfLastMessage();
        },
        error: (err) => {
          this.isThinking.set(false);
          this.messages.update(msgs => [...msgs, {
            role: 'assistant',
            content: {message: err.error.message || 'Something went wrong. Try again.'},
            timestamp: new Date(),
          }]);
        },
      });
      return;
    }

    this.messages.update(msgs => [...msgs, {role: 'user', content: {message: value}, timestamp: new Date()}]);
    this.termInput.nativeElement.value = '';
    this.termInput.nativeElement.style.height = 'auto';
    this.isThinking.set(true);
    this.scrollHistoryToBottom();

    this.chatService.chat(value).subscribe({
      next: (reply) => {
        this.isThinking.set(false);
        this.messages.update(msgs => [...msgs, {role: 'assistant', content: reply, timestamp: new Date(), tone: this.chatService.tone || undefined}]);
        this.scrollToStartOfLastMessage();
      },
      error: (er) => {
        this.isThinking.set(false);
        this.messages.update(msgs => [
          ...msgs,
          {role: 'assistant', content: {message: 'Something went wrong. Try again.'}, timestamp: new Date()},
        ]);
      },
    });
  }

  private showCursor(): void {
    this.positionCursor();
    const el = this.idleCursorEl;
    if (el) {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    }
    this.cursorVisible.set(true);
  }

  private positionCursor(): void {
    const mirror = this.termMirror.nativeElement;
    const wrap = this.inputWrap.nativeElement;
    const text = this.termInput.nativeElement.value;

    mirror.textContent = text || '\u200b';

    const wrapRect = wrap.getBoundingClientRect();
    const textNode = mirror.firstChild!;
    const range = document.createRange();
    const len = textNode.textContent!.length;
    range.setStart(textNode, Math.max(0, len - 1));
    range.setEnd(textNode, len);
    const charRect = range.getBoundingClientRect();

    const top = charRect.bottom - wrapRect.top - 15;
    const left = text.length === 0 ? 0 : charRect.right - wrapRect.left;

    this.cursorTop.set(Math.max(0, top));
    this.cursorLeft.set(Math.max(0, left));
  }

  private get idleCursorEl(): HTMLElement | null {
    const wrap = this.inputWrap?.nativeElement;
    if (!wrap) return null;
    return wrap.querySelector<HTMLElement>('span[style*="display"]') ??
      wrap.lastElementChild as HTMLElement;
  }

  private scrollHistoryToBottom(): void {
    afterNextRender(() => {
      const el = this.termHistory.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, {injector: this.injector});
  }

  private scrollToStartOfLastMessage(): void {
    afterNextRender(() => {
      const el = this.termHistory.nativeElement;
      const bubbles = el.querySelectorAll<HTMLElement>('.msg-bubble');
      const last = bubbles[bubbles.length - 1];
      if (last) {
        el.scrollTop = last.offsetTop - el.offsetTop;
      }
    }, {injector: this.injector});
  }
}

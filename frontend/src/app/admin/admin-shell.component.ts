import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {IconComponent} from './shared/icon.component';
import {COLLECTION} from './kb-data';

// App shell for the Vector Store Console — sidebar (stays mounted) + routed pages.
// Styled with the main site's Tailwind tokens (no dedicated stylesheet).
@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 flex bg-bg text-body font-mono text-[13px] overflow-hidden">
      <aside class="w-16 md:w-[238px] shrink-0 bg-bg3 border-r border-border flex flex-col">
        <div class="flex items-center gap-2.5 px-3 md:px-[18px] py-4 border-b border-border justify-center md:justify-start">
          <div class="w-[26px] h-[26px] shrink-0 border border-amber rounded-md flex items-center justify-center text-amber text-sm shadow-[inset_0_0_14px_rgba(240,168,50,0.25)]">◈</div>
          <div class="hidden md:block">
            <div class="text-text font-semibold text-[13px] tracking-wide">OZONEWAVE</div>
            <div class="text-muted text-[10.5px] tracking-wider">vector console</div>
          </div>
        </div>
        <div class="hidden md:block px-[14px] pt-[18px] pb-[7px] text-muted text-[10px] tracking-[1.4px] uppercase">Store</div>
        <nav class="flex flex-col gap-0.5 px-2.5 mt-2 md:mt-0">
          <a class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-body cursor-pointer border border-transparent whitespace-nowrap justify-center md:justify-start hover:bg-white/[0.035] [&.on]:bg-amber/10 [&.on]:border-amber/35 [&.on]:text-amber"
             routerLink="/admin/test" routerLinkActive="on">
            <va-icon name="test"/><span class="hidden md:inline">Test embeddings</span>
          </a>
          <a class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-body cursor-pointer border border-transparent whitespace-nowrap justify-center md:justify-start hover:bg-white/[0.035] [&.on]:bg-amber/10 [&.on]:border-amber/35 [&.on]:text-amber"
             routerLink="/admin/embeddings" routerLinkActive="on"
             [routerLinkActiveOptions]="{exact: false}">
            <va-icon name="list"/><span class="hidden md:inline">Embeddings</span>
            <span class="hidden md:inline ml-auto text-muted text-[11px] group-[.on]:text-amber">{{ totalChunks }}</span>
          </a>
        </nav>
        <div class="mt-auto px-4 py-3.5 border-t border-border flex items-center gap-2.5 justify-center md:justify-start">
          <div class="w-[30px] h-[30px] shrink-0 rounded-md bg-gradient-to-br from-amber/30 to-amber/5 border border-border2 flex items-center justify-center text-amber text-[11px]">AP</div>
          <div class="hidden md:block">
            <div class="text-text text-xs">Anton Pavlik</div>
            <div class="text-muted text-[10.5px]">owner</div>
          </div>
        </div>
      </aside>

      <router-outlet/>
    </div>
  `,
})
export class AdminShellComponent {
  readonly totalChunks = COLLECTION.totalChunks;
}

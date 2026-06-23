import {Injectable} from '@angular/core';

declare global {
  interface Window {
    Calendly?: { initPopupWidget(options: { url: string }): void };
  }
}

const WIDGET_CSS = 'https://assets.calendly.com/assets/external/widget.css';
const WIDGET_JS = 'https://assets.calendly.com/assets/external/widget.js';

/**
 * Lazily loads Calendly's popup widget (CSS + JS) on first use, then opens the
 * scheduler as a modal overlay. The external assets are fetched once and reused
 * on subsequent clicks.
 */
@Injectable({providedIn: 'root'})
export class CalendlyService {
  private scriptPromise?: Promise<void>;

  open(url: string): void {
    this.load().then(() => window.Calendly?.initPopupWidget({url}));
  }

  private load(): Promise<void> {
    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    if (!document.querySelector(`link[href="${WIDGET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = WIDGET_CSS;
      document.head.appendChild(link);
    }

    this.scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = WIDGET_JS;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Calendly widget'));
      document.head.appendChild(script);
    });

    return this.scriptPromise;
  }
}

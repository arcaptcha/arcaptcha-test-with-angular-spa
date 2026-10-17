import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

type WidgetId = string | number;

interface ArcaptchaApi {
  render(
    container: HTMLElement | string,
    params: { site_key: string; callback: string; error_callback: string },
  ): WidgetId;
  reset(widgetId?: WidgetId): void;
}

declare global {
  interface Window {
    arcaptcha?: ArcaptchaApi;
  }
}

export interface RenderedCaptcha {
  reset(): void;
  destroy(): void;
}

@Injectable({ providedIn: 'root' })
export class ArcaptchaService {
  private callbackIndex = 0;

  async render(
    container: HTMLElement,
    onToken: (token: string) => void,
    onError: (message: string) => void,
  ): Promise<RenderedCaptcha> {
    const api = await this.waitForApi();
    const callbackName = `__arcaptchaSuccess${++this.callbackIndex}`;
    const errorCallbackName = `__arcaptchaError${this.callbackIndex}`;
    const globalCallbacks = window as unknown as Record<string, (value: unknown) => void>;

    globalCallbacks[callbackName] = (value: unknown) => {
      onToken(this.readToken(value));
    };
    globalCallbacks[errorCallbackName] = (value: unknown) => {
      const message =
        typeof value === 'object' && value !== null && 'message' in value
          ? String(value.message)
          : 'The ARCaptcha widget could not be loaded.';
      onError(message);
    };

    let widgetId: WidgetId;
    try {
      widgetId = api.render(container, {
        site_key: environment.arcaptchaSiteKey,
        callback: callbackName,
        error_callback: errorCallbackName,
      });
    } catch (error: unknown) {
      delete globalCallbacks[callbackName];
      delete globalCallbacks[errorCallbackName];
      throw error;
    }

    return {
      reset: () => api.reset(widgetId),
      destroy: () => {
        api.reset(widgetId);
        delete globalCallbacks[callbackName];
        delete globalCallbacks[errorCallbackName];
      },
    };
  }

  private readToken(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      if ('arcaptcha_token' in value) return String(value.arcaptcha_token ?? '');
      if ('token' in value) return String(value.token ?? '');
    }
    return '';
  }

  private waitForApi(): Promise<ArcaptchaApi> {
    if (window.arcaptcha) return Promise.resolve(window.arcaptcha);

    return new Promise<ArcaptchaApi>((resolve, reject) => {
      const script = document.querySelector<HTMLScriptElement>('[data-arcaptcha-script]');
      if (!script) {
        reject(new Error('The ARCaptcha script was not found in index.html.'));
        return;
      }

      let settled = false;
      const interval = window.setInterval(() => {
        if (window.arcaptcha) finish(window.arcaptcha);
      }, 100);
      const timeout = window.setTimeout(() => {
        finish(undefined, new Error('Timed out while loading the ARCaptcha script.'));
      }, 15000);
      const onError = () => finish(undefined, new Error('Could not load the ARCaptcha script.'));

      const finish = (api?: ArcaptchaApi, error?: Error) => {
        if (settled) return;
        settled = true;
        window.clearInterval(interval);
        window.clearTimeout(timeout);
        script.removeEventListener('error', onError);
        if (api) resolve(api);
        else reject(error ?? new Error('ARCaptcha is unavailable.'));
      };

      script.addEventListener('error', onError, { once: true });
      if (window.arcaptcha) finish(window.arcaptcha);
    });
  }
}

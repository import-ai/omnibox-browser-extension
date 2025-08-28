import axios from './axios.js';

class EventStorage {
  private loaded: boolean = false;
  private storageKey = 'omnibox_track_event';
  private cache = new Map<string, boolean>();

  private async loadFromStorage(): Promise<void> {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    const result = await chrome.storage.local.get(this.storageKey);
    const stored = result[this.storageKey];
    if (stored && typeof stored === 'object') {
      Object.entries(stored).forEach(([key, value]) => {
        this.cache.set(key, value as TrackedEvent);
      });
    }
  }

  async markEventAsTracked(eventKey: string): Promise<void> {
    await this.loadFromStorage();

    this.cache.set(eventKey, true);

    const data = Object.fromEntries(this.cache.entries());
    await chrome.storage.local.set({
      [this.storageKey]: data,
    });
  }

  async isEventTracked(eventKey: string): Promise<boolean> {
    await this.loadFromStorage();

    return this.cache.has(eventKey);
  }
}

const eventStorage = new EventStorage();

interface Attributes {
  once?: boolean;
  [key: string]: any;
}

export async function track(event: string, payload: Attributes = {}) {
  const { once = false, ...attributes } = payload;

  const apiBaseUrl = await chrome.storage.local.get('apiBaseUrl');

  if (!apiBaseUrl) {
    // 未登陆不统计
    return;
  }

  // Handle different "once" modes
  if (once && (await eventStorage.isEventTracked(event))) {
    return;
  }

  try {
    await axios(`${apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl}/api/v1/track`, {
      data: {
        event,
        attributes,
      },
    });
    if (once) {
      await eventStorage.markEventAsTracked(event);
    }
  } catch (err) {
    console.error(err);
  }
}

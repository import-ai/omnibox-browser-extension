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
        this.cache.set(key, value as boolean);
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
  url?: string;
  referrer?: string;
  finger?: string;
  section?: string;
  language?: string;
}

export async function track(name: string, payload: Attributes = {}) {
  const { once = false, ...props } = payload;

  const storage = await chrome.storage.sync.get('apiBaseUrl');

  if (!storage.apiBaseUrl) {
    return;
  }

  if (once && (await eventStorage.isEventTracked(name))) {
    return;
  }

  try {
    await axios(
      `${storage.apiBaseUrl.endsWith('/') ? storage.apiBaseUrl.slice(0, -1) : storage.apiBaseUrl}/api/v1/trace`,
      {
        events: [
          {
            name,
            props,
          },
        ],
      },
    );
    if (once) {
      await eventStorage.markEventAsTracked(name);
    }
  } catch (err) {
    console.error(err);
  }
}

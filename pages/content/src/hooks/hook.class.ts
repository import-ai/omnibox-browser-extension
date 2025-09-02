/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction, isString, isUndefined } from '@src/utils/is';

type Queue = {
  once: boolean;
  priority: number;
  factory: string;
};

export default class Hook {
  private _caches: {
    [index: string]: any;
  } = {};
  private _hooks: {
    [index: string]: Array<{
      once: boolean;
      priority: number;
      factory: any;
    }>;
  } = {};

  private __addFilter(id: string, callback: string | any, once?: boolean, priority: number = 10) {
    if (!Array.isArray(this._hooks[id])) {
      this._hooks[id] = [];
    }
    const insertIndex = this._hooks[id].findIndex((item: Queue) => item.priority <= priority);
    const factory = isString(callback)
      ? (...args: any) => this.fire.apply(this, [callback as string, ...args])
      : callback;
    this._hooks[id].splice(insertIndex + 1, 0, {
      factory,
      priority,
      once: !!once,
    });
    if (Array.isArray(this._caches[id])) {
      this._caches[id].forEach((args: any) => {
        this.applyFilter(id, ...args);
      });
      delete this._caches[id];
    }
    return () => {
      this.__remove(id, factory);
    };
  }

  private __remove(id: string, callback?: any) {
    if (this.hasHook(id)) {
      if (isFunction(callback)) {
        const removeIndex = this._hooks[id].findIndex((item: any) => item.factory === callback);
        if (removeIndex >= 0) {
          this._hooks[id].splice(removeIndex, 1);
        }
      } else {
        delete this._hooks[id];
      }
    }
    if (Array.isArray(this._caches[id])) {
      delete this._caches[id];
    }
  }

  removeHook(id: string | string[], callback?: () => void) {
    if (Array.isArray(id)) {
      id.forEach(item => {
        this.__remove(item);
      });
      return;
    }
    this.__remove(id, callback);
  }

  hasHook(id: string) {
    return !!this._hooks[id];
  }

  addFilter(id: string | string[], callback: string | any, once?: boolean, priority?: number) {
    if (Array.isArray(id)) {
      const destroys: Array<() => void> = [];
      id.forEach(item => {
        destroys.push(this.__addFilter(item, callback, once, priority));
      });
      return () => {
        destroys.forEach(destory => {
          destory();
        });
      };
    }
    return this.__addFilter(id, callback, once, priority);
  }

  applyFilter(id: string, ...args: any[]) {
    if (!this.hasHook(id)) {
      if (!Array.isArray(this._caches[id])) {
        this._caches[id] = [];
      }
      this._caches[id].push(args);
      return args[0];
    }
    const hooksToRemove: Array<() => void> = [];
    if (this._hooks[id]) {
      this._hooks[id].forEach((item: Queue) => {
        const factory = item.factory as any;
        const returnValue = isFunction(factory) ? factory.apply(this, args) : factory;
        if (!isUndefined(returnValue)) {
          args[0] = returnValue;
        }
        if (item.once) {
          hooksToRemove.push(factory);
        }
      });
    }
    hooksToRemove.forEach((factory: () => void) => {
      this.removeHook(id, factory);
    });
    return args[0];
  }

  on(id: string, callback: string | any, once?: boolean, priority?: number) {
    return this.addFilter(id, callback, once, priority);
  }

  fire(id: string, ...args: any) {
    this.applyFilter(id, ...args);
  }
}

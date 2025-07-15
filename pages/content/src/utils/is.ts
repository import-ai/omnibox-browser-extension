/* eslint-disable @typescript-eslint/no-explicit-any */
export function isType(value: any, type: string): boolean {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isUndefined(value: any): value is undefined {
  return isType(value, 'Undefined');
}

export function isString(value: any): value is string {
  return isType(value, 'String');
}

export function isElement(value: any): value is HTMLElement {
  return value && value.nodeType && value.nodeType === 1;
}

export function isNumber(value: any): value is number {
  return isType(value, 'Number');
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return isType(value, 'Function');
}

export function isBoolean(value: any): value is boolean {
  return isType(value, 'Boolean');
}

export function isObject(value: any): value is Record<string, any> {
  return isType(value, 'Object');
}

export function isAsyncFunction(value: any): value is Promise<any> {
  return isType(value, 'AsyncFunction');
}

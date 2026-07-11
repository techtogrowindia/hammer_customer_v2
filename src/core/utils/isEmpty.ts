type Sized = string | any[] | Map<any, any> | Set<any>;
type Emptyable<T> = T | null | undefined | Sized | object;

export const isEmpty = <T>(value: Emptyable<T>): boolean => {
  if (value === null || typeof value === 'undefined') {
    return true;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value as object).length === 0;
  }
  return false;
};

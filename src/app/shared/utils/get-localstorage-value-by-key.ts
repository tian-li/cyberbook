export function getLocalStorageValueByKey(key: string): null | string {
  const value = localStorage.getItem(key);
  if (value === 'null' || value === 'undefined') {
    return null;
  } else {
    return value;
  }
}

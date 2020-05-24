export function getUserIdFromLocalStorage(): null | string {
  const localUser = localStorage.getItem('userId');
  return !!localUser || localUser !== 'undefined' ? localUser : null;
}

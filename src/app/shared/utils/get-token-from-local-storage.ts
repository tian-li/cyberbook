export function getTokenFromLocalStorage(): null | string {
  const localToken = localStorage.getItem('jwt_token');
  return !!localToken && localToken !== 'undefined' ? localToken : null;
}

export const defaultSnackBarDuration = 3000;
export const defaultSnackBarAction = 'OK';

export interface SnackBar {
  message: string;
  action: string;
  duration: number;
  prefixIcon: string;
  level: 'success' | 'warn' | 'error' | 'info';
}
export enum LevelPrefix {
  success = '✅',
  warn = '⚠️',
  error = '❌' ,
  info = 'ℹ️'
}

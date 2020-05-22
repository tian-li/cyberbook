export const defaultSnackBarDuration = 2000;
export const defaultSnackBarAction = 'OK';

export interface SnackBar {
  message: string;
  action: string;
  duration: number;
}

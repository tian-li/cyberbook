export const defaultSnackBarDuration = 3000;
export const defaultSnackBarAction = 'OK';

export interface SnackBar {
  message: string;
  action: string;
  duration: number;
}

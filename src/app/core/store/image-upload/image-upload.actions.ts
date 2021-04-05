import { createAction, props } from '@ngrx/store';

export const uploadProfileImage = createAction(
  '[ImageUpload] Upload Profile Image',
  props<{ image: any }>()
);

export const uploadProfileImageSuccess = createAction(
  '[ImageUpload] Upload Profile Image Success',
  props<{ imageName: string }>()
);

export const uploadImageError = createAction(
  '[ImageUpload] Upload Image Error',
  props<{ error: string }>()
);

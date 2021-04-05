import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { ImageUploadService } from '../../services/image-upload.service';
import { uploadProfileImage, uploadProfileImageSuccess } from './image-upload.actions';

@Injectable()
export class ImageUploadEffects {

  // uploadProfileImage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(uploadProfileImage),
  //     switchMap((action) =>
  //       this.imageUploadService.uploadImage(action.image).pipe(
  //         map((imageName) => uploadProfileImageSuccess({ imageName })),
  //       ))
  //   )
  // );


  constructor(private imageUploadService: ImageUploadService, private actions$: Actions) {
  }
}

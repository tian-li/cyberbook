import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'imageUrl' })
export class ImageUrlPipe implements PipeTransform {
  transform(imageName: string, userId: string, fallbackImage: string): string {

    if(!imageName) {
      return fallbackImage;
    }
    return `${environment.imageServer}/${userId}/${imageName}`;
  }
}

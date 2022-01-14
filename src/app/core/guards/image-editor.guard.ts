import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ImageUploadService } from '../services/image-upload.service';

@Injectable()
export class ImageEditorGuard implements CanActivate {
  constructor(private imageUploadService: ImageUploadService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | UrlTree {
    if (this.imageUploadService.image) {
      return of(true);
    } else {
      return this.router.createUrlTree(['./home']);
    }
  }
}

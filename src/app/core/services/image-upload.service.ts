import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UploadStatus } from '@cyberbook/shared/constants';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';



@Injectable()
export class ImageUploadService {
  readonly imageRoute = `${environment.server}/image`;

  progress$ = new BehaviorSubject(0);
  status$ = new BehaviorSubject(UploadStatus.NotStarted);

  constructor(private http: HttpClient) {
  }

  resetUpload() {
    this.progress$.next(0);
    this.status$.next(UploadStatus.NotStarted);
  }

  finishUpload() {
    this.progress$.next(100);
    this.status$.next(UploadStatus.Finished);
  }

  uploadImage(image: File) {
    const formData: FormData = new FormData();
    formData.append('file', image);

    return this.http.post(`${this.imageRoute}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          this.status$.next(UploadStatus.Started);
          break;
        case HttpEventType.UploadProgress:
          this.status$.next(UploadStatus.InProgress);
          this.progress$.next(Math.round(event.loaded / event.total * 100));
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          this.status$.next(UploadStatus.Waiting);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          this.finishUpload();
          break;
      }
    });
  }
}

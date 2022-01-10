import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification';
import { updateProfile } from '@cyberbook/core/store/user';
import { UploadStatus, UploadRole } from '@cyberbook/shared/constants';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CyberbookServerResponse } from '../model/cyberbook-server-response';

const allowedImageTypes = ['image/png', 'image/jpeg'];

@Injectable()
export class ImageUploadService {
  readonly imageRoute = `${environment.server}/image`;

  progress$ = new BehaviorSubject(0);
  status$ = new BehaviorSubject(UploadStatus.NotStarted);

  image!: File;

  constructor(private http: HttpClient, private store: Store) {
    // this.image =
  }

  uploadImage(image: File, uploadRole: UploadRole) {
    this.checkRealMimeType(image).then((valid: boolean) => {
      if (valid) {
        this.doUpload(image, uploadRole);
      }
    }).catch(() => {
      this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '不支持此类型的文件', level: 'error' } }));
    });
  }

  private doUpload(image: File, uploadRole: UploadRole) {
    const formData: FormData = new FormData();

    formData.append('file', image);
    formData.append('role', uploadRole);

    this.http.post<CyberbookServerResponse>(`${this.imageRoute}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: HttpEvent<CyberbookServerResponse>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.status$.next(UploadStatus.Started);
            break;
          case HttpEventType.UploadProgress:
            this.status$.next(UploadStatus.InProgress);
            this.progress$.next(Math.round(event.loaded / event.total! * 100));
            break;
          case HttpEventType.Response:
            this.processUploadResult(event.body!.data, uploadRole);
            this.finishUpload();
            break;
        }
      },
      (error) => {
        this.store.dispatch(notifyWithSnackBar({ snackBar: { message: '发生未知错误，请稍后重试', level: 'error' } }));
      });
  }

  private checkRealMimeType(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = (e: any) => {
        const arr = (new Uint8Array(e.target.result)).subarray(0, 4);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        // Check the file signature against known types
        let type = 'unknown';
        switch (header) {
          case '89504e47':
            type = 'image/png';
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
            type = 'image/jpeg';
            break;
        }

        if (file.type === type && allowedImageTypes.includes(type)) {
          resolve(true);
        } else {
          reject(false);
        }
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  private finishUpload() {
    this.progress$.next(100);
    this.status$.next(UploadStatus.Finished);
  }

  private processUploadResult(imageName: string, target: UploadRole) {
    switch (target) {
      case UploadRole.Profile:
        this.store.dispatch(updateProfile({
          user: {
            profilePhoto: imageName
          }
        }));
    }
  }
}

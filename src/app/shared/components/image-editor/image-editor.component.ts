import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImageUploadService } from '@cyberbook/core/services/image-upload.service';
import { hideToolbar, showToolbar } from '@cyberbook/core/store/ui';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, OnDestroy {

  image: File;

  @ViewChild('imageElement') imageElement: ElementRef;
  @ViewChild('cropMask') cropMask: ElementRef;
  naturalWidth;
  naturalHeight;
  naturalRatio;
  displayWidth = 280;
  displayHeight = 280;

  displayOffsetLeft = 0;
  displayOffsetTop = 0;

  previousOffsetLeft = 0;
  previousOffsetTop = 0;

  initialOffsetLeft = 0;
  initialOffsetTop = 0;

  minOffsetLeft = 0;
  minOffsetTop = 0;

  constructor(
    private imageUploadService: ImageUploadService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(hideToolbar());
    console.log('image', this.imageUploadService.image);
    //
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imageElement.nativeElement.setAttribute('src', e.target.result);

      console.log('reader', e);
    };


    // reader.readAsDataURL(this.imageUploadService.image);
    reader.readAsDataURL(this.imageUploadService.image);
  }

  ngOnDestroy() {
    this.store.dispatch(showToolbar());
  }

  onImgLoad(event) {
    console.log('onImgLoad', event);
    this.naturalWidth = this.imageElement.nativeElement.naturalWidth;
    this.naturalHeight = this.imageElement.nativeElement.naturalHeight;

    this.naturalRatio = this.naturalWidth / this.naturalHeight;

    this.calculateInitialSize();

  }

  calculateInitialSize() {
    if (this.naturalWidth < this.naturalHeight) {
      this.setDisplaySize(280, (280 / this.naturalWidth) * this.naturalHeight);
    } else if (this.naturalWidth > this.naturalHeight) {
      this.setDisplaySize((280 / this.naturalHeight) * this.naturalWidth, 280);
    } else {
      this.setDisplaySize(280, 280);
    }
  }

  setDisplaySize(width: number, height: number) {
    this.displayWidth = width;
    this.displayHeight = height;

    if (this.displayWidth > 280) {
      this.displayOffsetLeft = -(this.displayWidth - 280) / 2;
      this.initialOffsetLeft = this.displayOffsetLeft;
      this.minOffsetLeft = -(this.displayWidth - 280);
      this.previousOffsetLeft = this.displayOffsetLeft;

    }

    if (this.displayHeight > 280) {
      this.displayOffsetTop = -(this.displayHeight - 280) / 2;
      this.initialOffsetTop = this.displayOffsetTop;
      this.minOffsetTop = -(this.displayHeight - 280);
      this.previousOffsetTop = this.displayOffsetTop;

    }
  }

  onTouchstart(e) {
    // console.log();
  }


  onTouchMove({ diffX, diffY }) {
    console.log('onTouchMove', { diffX, diffY });

    const resultX = this.previousOffsetLeft + diffX;
    const resultY = this.previousOffsetTop + diffY;

    if (resultX > 0) {
      this.displayOffsetLeft = 0;
    } else if (resultX < this.minOffsetLeft) {
      this.displayOffsetLeft = this.minOffsetLeft;
    } else {
      this.displayOffsetLeft = resultX;
    }

    if (resultY > 0) {
      this.displayOffsetTop = 0;
    } else if (resultY < this.minOffsetTop) {
      this.displayOffsetTop = this.minOffsetTop;
    } else {
      this.displayOffsetTop = resultY;
    }

  }

  onTouchend({ diffX, diffY }) {
    console.log('onTouchend', { diffX, diffY });
    const resultX = this.previousOffsetLeft + diffX;
    const resultY = this.previousOffsetTop + diffY;
    if (resultX > 0) {
      this.previousOffsetLeft = 0;
    } else if (resultX < this.minOffsetLeft) {
      this.previousOffsetLeft = this.minOffsetLeft;
    } else {
      this.previousOffsetLeft = resultX;
    }

    if (resultY > 0) {
      this.previousOffsetTop = 0;
    } else if (resultY < this.minOffsetTop) {
      this.previousOffsetTop = this.minOffsetTop;
    } else {
      this.previousOffsetTop = resultY;
    }


    // this.previousOffsetLeft = diffX;
    // this.previousOffsetTop = diffY;
  }

  calculate() {
    let width = this.cropMask.nativeElement.getBoundingClientRect().width;
    let height = this.cropMask.nativeElement.getBoundingClientRect().height;

    console.log(
      this.cropMask.nativeElement.getBoundingClientRect()
    );

    console.log(width, height);

    let offsetWidth = this.cropMask.nativeElement.offsetWidth;
    let offsetHeight = this.cropMask.nativeElement.offsetHeight;

    // console.log(
    //   this.cropMask.nativeElement.getBoundingClientRect()
    // );

    // this.size = Math.min(offsetWidth, offsetHeight) + 'px';

    console.log('offset on load', offsetWidth, offsetHeight);
  }

  ngAfterViewInit() {
    // let width = this.cropMask.nativeElement.offsetWidth;
    // let height = this.cropMask.nativeElement.offsetHeight;

    // console.log(
    //   this.cropMask.nativeElement.getBoundingClientRect()
    // );

    // console.log('offset', width, height)
  }

}

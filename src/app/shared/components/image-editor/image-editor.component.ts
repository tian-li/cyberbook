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
  @ViewChild('previewCanvas') previewCanvas: ElementRef;
  @ViewChild('cropMask') cropMask: ElementRef;
  naturalWidth;
  naturalHeight;
  naturalRatio;
  displayWidth = 280;
  displayHeight = 280;

  displayOffsetLeft = 0;
  displayOffsetTop = 0;
  scaleRatio = 1;
  translateX = 0;
  translateY = 0;
  scaleOriginX;
  scaleOriginY;

  displayRatio = 1;

  constructor(
    private imageUploadService: ImageUploadService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(hideToolbar());
    // console.log('image', this.imageUploadService.image);
    // //
    // const reader = new FileReader();
    //
    // reader.onload = (e) => {
    //   this.imageElement.nativeElement.setAttribute('src', e.target.result);
    //
    //   console.log('reader', e);
    // };
    //
    //
    // // reader.readAsDataURL(this.imageUploadService.image);
    // reader.readAsDataURL(this.imageUploadService.image);
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
    }

    if (this.displayHeight > 280) {
      this.displayOffsetTop = -(this.displayHeight - 280) / 2;
    }

    this.displayRatio = this.displayWidth/this.naturalWidth;
  }

  onResult(e) {
    this.scaleRatio = e.scaleRatio;
    this.translateX = e.translateX;
    this.translateY = e.translateY;
    this.scaleOriginX = e.scaleOriginX;
    this.scaleOriginY = e.scaleOriginY;
    console.log('onResult', e);
  }

  cutImage() {
    console.log('this.displayRatio',this.displayRatio);
    const originalImg = this.imageElement.nativeElement;
    let styles = window.getComputedStyle(originalImg, null);
    const transform =  styles.getPropertyValue('transform');
    const transformOrigin =  styles.getPropertyValue('transform-origin');


    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    // console.log('this.naturalWidth', this.naturalWidth);
    // console.log('this.naturalHeight', this.naturalHeight);
    // console.log('this.scaleRatio', this.scaleRatio);

    const sx = Math.abs(this.displayOffsetLeft + this.translateX)/this.displayRatio* (this.scaleRatio )
    const sy = Math.abs(this.displayOffsetTop + this.translateY) /this.displayRatio* (this.scaleRatio )
    const options = {
      // sx : this.naturalWidth -(this.translateX - this.displayOffsetLeft)/this.displayRatio ,
      // sy : this.naturalHeight -(this.translateY - this.displayOffsetTop) /this.displayRatio,
      sx : sx ,
      sy : sy ,
      // sx : 500,
      // sy :500,
      sWidth : 280/this.displayRatio / (this.scaleRatio ),
      sHeight : 280/this.displayRatio / (this.scaleRatio ),
      dx : 0,
      dy : 0,
      dWidth : 280,
      dHeight : 280
    }

    console.log('options.', options);

    const image = new Image();

    image.width = this.displayWidth;
    image.height = this.displayHeight;
    image.style.transform = transform
    image.style.transformOrigin = transformOrigin
    image.src = '../../../../assets/images/summer.jpg';

    image.onload = () => {

      console.log('img', image);

      ctx.drawImage(image, options.sx, options.sy, options.sWidth, options.sHeight, options.dx, options.dy, options.dWidth, options.dHeight);
      // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    };

  }

}

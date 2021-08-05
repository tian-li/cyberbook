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
  @ViewChild('imgRes') imgRes: ElementRef;
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
  scaleOriginX = 0;
  scaleOriginY = 0;

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

    this.displayRatio = this.displayWidth / this.naturalWidth;
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
    console.log('---------------');
    console.log('this.displayRatio', this.displayRatio);
    const originalImg = this.imageElement.nativeElement;
    let styles = window.getComputedStyle(originalImg, null);
    const transform = styles.getPropertyValue('transform');
    const transformOrigin = styles.getPropertyValue('transform-origin');


    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    // console.log('this.naturalWidth', this.naturalWidth);
    // console.log('this.naturalHeight', this.naturalHeight);
    // console.log('this.scaleRatio', this.scaleRatio);

    console.log('displayOffsetLeft', this.displayOffsetLeft);
    console.log('translateX', this.translateX);
    console.log('displayOffsetTop', this.displayOffsetTop);
    console.log('translateY', this.translateY);
    console.log('scaleOriginX', this.scaleOriginX);
    console.log('scaleOriginY', this.scaleOriginY);
    console.log('scaleRatio', this.scaleRatio);


    const sWidth = 280 / this.displayRatio / this.scaleRatio;
    const sHeight = 280 / this.displayRatio / this.scaleRatio;

    let sx;
    let sy;
    if (this.scaleRatio === 1) {
      sx = Math.abs(this.displayOffsetLeft + this.translateX) / this.displayRatio;
      sy = Math.abs(this.displayOffsetTop + this.translateY) / this.displayRatio;
    } else {


      sx = (this.displayWidth * this.scaleRatio) / 2  - 140;
      sy = (this.displayHeight * this.scaleRatio) / 2 - 140;

      // sx = Math.abs(this.displayOffsetLeft + (this.translateX + this.scaleOriginX)) / this.scaleRatio / this.displayRatio;
      // sy = Math.abs(this.displayOffsetTop + (this.translateY + this.scaleOriginY)) / this.scaleRatio / this.displayRatio;
    }


    // const sx = Math.abs((this.scaleOriginX - this.displayOffsetLeft) / this.scaleRatio - (this.translateX / this.scaleRatio)) / this.displayRatio;
    // const sy = Math.abs( (this.scaleOriginY-this.displayOffsetTop) / this.scaleRatio - (this.translateY / this.scaleRatio)) / this.displayRatio;
    const options = {
      // sx : this.naturalWidth -(this.translateX - this.displayOffsetLeft)/this.displayRatio ,
      // sy : this.naturalHeight -(this.translateY - this.displayOffsetTop) /this.displayRatio,
      sx: sx,
      sy: sy,
      // sx : 500,
      // sy :500,
      // sx: 0,
      // sy: 0,
      sWidth: 280 / this.displayRatio / this.scaleRatio,
      sHeight: 280 / this.displayRatio / this.scaleRatio,
      dx: 0,
      dy: 0,
      dWidth: 280,
      dHeight: 280
    };

    console.log('options.', options);

    const image = new Image();

    // image.width = this.displayWidth;
    // image.height = this.displayHeight;
    // image.style.transform = transform
    // image.style.transformOrigin = transformOrigin
    // image.src = '../../../../assets/images/summer.jpg';

    image.width = 280;
    image.height = 280;
    // image.style.transform = transform;
    // image.style.transformOrigin = transformOrigin;
    // image.src = '../../../../assets/images/v.jpeg';
    image.src = '../../../../assets/images/summer.jpg';

    // this.imgRes.nativeElement.appendChild(image);

    image.onload = () => {

      console.log('img', image);
      // ctx.clearRect(0, 0, 280, 280);
      // ctx.drawImage(image, options.sx, options.sy, options.sWidth, options.sHeight, options.dx, options.dy, options.dWidth, options.dHeight);
      // ctx.translate(this.translateX, this.translateY);
      ctx.drawImage(image, options.sx, options.sy, options.sWidth, options.sHeight, options.dx, options.dy, options.dWidth, options.dHeight);
      // ctx.
      // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    };
    console.log('-------------');
  }

}

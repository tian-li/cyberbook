import { Component, ElementRef, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ImageUploadService } from '@cyberbook/core/services/image-upload.service';
import { hideToolbar, showToolbar } from '@cyberbook/core/store/ui';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, OnDestroy {
  image!: File;

  @ViewChild('imageElement') imageElement!: ElementRef;
  @ViewChild('previewCanvas') previewCanvas!: ElementRef;
  @ViewChild('cropperWindow') cropperWindow!: ElementRef;
  naturalWidth!: number;
  naturalHeight!: number;
  displayWidth = 280;
  displayHeight = 280;
  displayOffsetLeft = 0;
  displayOffsetTop = 0;
  displayRatio = 1;

  scaleRatio = 1;

  cropperWindowDomRect: any
  imageResult: any;
  reader = new FileReader();

  constructor(
    private imageUploadService: ImageUploadService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(hideToolbar());
    this.reader.onload = (e: any) => {
      this.imageResult = e.target.result;
      this.imageElement.nativeElement.setAttribute('src', this.imageResult );
    };
    // reader.readAsDataURL(this.imageUploadService.image);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['image'].currentValue) {
      this.reader.readAsDataURL(this.image)
    }
  }

  ngOnDestroy() {
    this.store.dispatch(showToolbar());
  }

  onImgLoad(event: any) {
    this.naturalWidth = this.imageElement.nativeElement.naturalWidth;
    this.naturalHeight = this.imageElement.nativeElement.naturalHeight;
    this.calculateInitialSize();
    this.cropperWindowDomRect = this.cropperWindow.nativeElement.getBoundingClientRect();
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

    if (this.displayWidth >= 280) {
      this.displayOffsetLeft = -(this.displayWidth - 280) / 2;
    }

    if (this.displayHeight >= 280) {
      this.displayOffsetTop = -(this.displayHeight - 280) / 2;
    }

    this.displayRatio = this.displayWidth / this.naturalWidth;
  }

  onResult(e: any) {
    this.scaleRatio = e.scaleRatio;
  }

  cutImage() {
    const originalImg = this.imageElement.nativeElement;
    const domRect = originalImg.getBoundingClientRect();
    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = this.imageResult;

    const options = {
      sx: (this.cropperWindowDomRect.x-domRect.x)/ this.displayRatio / this.scaleRatio,
      sy: (this.cropperWindowDomRect.y-domRect.y)/ this.displayRatio / this.scaleRatio,
      sWidth: 280 / this.displayRatio / this.scaleRatio,
      sHeight: 280 / this.displayRatio / this.scaleRatio,
      dx: 0,
      dy: 0,
      dWidth: 280,
      dHeight: 280
    };

    image.onload = () => {
      ctx.drawImage(image, options.sx, options.sy, options.sWidth, options.sHeight, options.dx, options.dy, options.dWidth, options.dHeight);
    };
  }

}

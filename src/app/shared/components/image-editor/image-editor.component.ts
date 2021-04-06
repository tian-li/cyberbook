import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit {

  image: File;

  @ViewChild('imageElement') imageElement: ElementRef;
  @ViewChild('cropMask') cropMask: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) private data: {image: File}) {
  }

  ngOnInit(): void {


    const reader = new FileReader();

    reader.onload = (e) => {
      this.imageElement.nativeElement.setAttribute("src", e.target.result);
    };

    reader.readAsDataURL(this.data.image);
  }

  size = '0px';

  calculate() {
    let width = this.cropMask.nativeElement.getBoundingClientRect().width;
    let height = this.cropMask.nativeElement.getBoundingClientRect().height;

    console.log(
      this.cropMask.nativeElement.getBoundingClientRect()
    );

    console.log(width, height)

    let offsetWidth = this.cropMask.nativeElement.offsetWidth;
    let offsetHeight = this.cropMask.nativeElement.offsetHeight;

    // console.log(
    //   this.cropMask.nativeElement.getBoundingClientRect()
    // );

    this.size = Math.min(offsetWidth, offsetHeight) + 'px';

    console.log('offset on load', offsetWidth, offsetHeight)
  }

  ngAfterViewInit() {
    let width = this.cropMask.nativeElement.offsetWidth;
    let height = this.cropMask.nativeElement.offsetHeight;

    // console.log(
    //   this.cropMask.nativeElement.getBoundingClientRect()
    // );

    console.log('offset', width, height)
  }

}

import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SwipeDirection, SwipeInfo } from '@cyberbook/shared/model/helper-models';

@Directive({
  selector: '[cbkTouchDragEvent]'
})
export class TouchDragEventDirective {
  @Input() touchDragDisabled = false;

  @Output() cbkDragStart = new EventEmitter<any>();
  @Output() cbkDragMove = new EventEmitter<any>();
  @Output() cbkDragEnd = new EventEmitter<any>();
  // @Output() cancelSwipe = new EventEmitter();

  private touchstartTime: number;
  private isDragging = false;
  private percentage = 0;
  private direction: SwipeDirection;

  // track moving
  private touchStartX: number;
  private touchStartY: number;
  private firstMoveX: number;
  private firstMoveY: number;
  private touchEndX: number;
  private touchEndY: number;

  @HostListener('touchstart', ['$event'])
  private onTouchStart(event: TouchEvent) {
    if (!this.isMultiTouch(event) && !this.touchDragDisabled) {
      this.touchStartX = event.touches[0].pageX;
      this.touchStartY = event.touches[0].pageY;
      this.touchstartTime = event.timeStamp;
    }
  }

  @HostListener('touchmove', ['$event'])
  private onTouchMove(event: TouchEvent) {
    if (this.touchDragDisabled) {
      event.preventDefault();
      return;
    }

    if (this.isMultiTouch(event)) {
      event.preventDefault();
      return;
    }

    this.touchEndX = event.touches[0].pageX;
    this.touchEndY = event.touches[0].pageY;

    const diffX = this.touchEndX - this.touchStartX;
    const diffY = this.touchEndY - this.touchStartY;

    this.cbkDragMove.emit({diffX, diffY});
  }

  @HostListener('touchend', ['$event'])
  private onTouchEnd(event: TouchEvent) {
    if (this.isMultiTouch(event) || this.touchDragDisabled) {
      event.preventDefault();
      return;
    }

    this.touchEndX = event.changedTouches[0].pageX;
    this.touchEndY = event.changedTouches[0].pageY;

    const diffX = this.touchEndX - this.touchStartX;
    const diffY = this.touchEndY - this.touchStartY;

    this.cbkDragEnd.emit({diffX, diffY});


    // if (this.isDragging) {
    //   this.cbkDragEnd.emit({ });
    // } else {
    //   // this.cancel();
    // }
    this.resetSwipeStatus();
  }

  private calculateSwipe() {
    const diff = this.touchEndX - this.touchStartX;
    switch (this.direction) {
      case 'left':
        this.percentage = diff < 0 ? Math.abs(diff) / window.innerWidth : 0;
        break;
      case 'right':
        this.percentage = diff > 0 ? Math.abs(diff) / window.innerWidth : 0;
        break;
      default:
        this.direction = diff < 0 ? 'left' : 'right';
        this.percentage = Math.abs(diff) / window.innerWidth;
    }

    if (this.percentage > 0.2) {
      this.percentage = Math.log10(this.percentage + 0.8) + 0.2;
    }
  }

  private triggerWipe() {
    this.cbkDragStart.emit({ direction: this.direction, percentage: this.percentage });
  }

  private isMultiTouch(event: TouchEvent): boolean {
    return event.touches.length > 1;
  }

  // private cancel() {
  //   this.isDragging = false;
  //   // this.cancelSwipe.emit();
  // }

  private resetSwipeStatus() {
    this.isDragging = false;
    this.touchstartTime = 0;
    this.percentage = 0;
    this.direction = undefined;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.firstMoveX = undefined;
    this.firstMoveY = undefined;
  }
}

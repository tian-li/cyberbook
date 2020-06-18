import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SwipeDirection, SwipeInfo } from '@spend-book/shared/model/helper-models';

@Directive({
  selector: '[appSwipeEvent]'
})
export class SwipeEventDirective {
  @Input('swipeDisabled') disabled: boolean = false;

  @Output() swipe = new EventEmitter<SwipeInfo>();
  @Output() endSwipe = new EventEmitter<SwipeInfo>();
  @Output() cancelSwipe = new EventEmitter();

  private touchstartTime: number;
  private isSwiping = false;
  private percentage = 0;
  private direction: SwipeDirection;

  // track moving
  private touchStartX: number;
  private touchStartY: number
  private firstMoveX: number;
  private firstMoveY: number;
  private touchEndX: number;
  private touchEndY: number;

  @HostListener('touchstart', ['$event'])
  private onTouchStart(event: TouchEvent) {
    if (!this.isMultiTouch(event) && !this.disabled) {
      this.touchStartX = event.touches[0].pageX;
      this.touchStartY = event.touches[0].pageY;
      this.touchstartTime = event.timeStamp;
    }
  }

  @HostListener('touchmove', ['$event'])
  private onTouchMove(event: TouchEvent) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    if (this.isMultiTouch(event)) {
      this.cancel();
      event.preventDefault();
      return;
    }

    if (!this.firstMoveX && !this.firstMoveY) {
      this.firstMoveX = event.touches[0].pageX;
      this.firstMoveY = event.touches[0].pageY;
      const xDiff = Math.abs(this.touchStartX - this.firstMoveX);
      const yDiff = Math.abs(this.touchStartY - this.firstMoveY);

      const ratio = yDiff / xDiff;

      this.isSwiping = ratio <= 0.5;
    }

    this.touchEndX = event.touches[0].pageX;
    this.touchEndY = event.touches[0].pageY;

    if (this.isSwiping) {
      event.preventDefault(); // prevent scroll when swipe to delete
      this.calculateSwipe();
      this.triggerWipe();
    }
  }

  @HostListener('touchend', ['$event'])
  private onTouchEnd(event: TouchEvent) {
    if (this.isMultiTouch(event) || this.disabled) {
      event.preventDefault();
      return;
    }
    if (this.isSwiping) {
      this.endSwipe.emit({ direction: this.direction, percentage: this.percentage });
    } else {
      this.cancel();
    }
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
      this.percentage = Math.log10(this.percentage + 0.8) + 0.2
    }
  }

  private triggerWipe() {
    this.swipe.emit({ direction: this.direction, percentage: this.percentage });
  }

  private isMultiTouch(event: TouchEvent): boolean {
    return event.touches.length > 1;
  }

  private cancel() {
    this.isSwiping = false;
    this.cancelSwipe.emit();
  }

  private resetSwipeStatus() {
    this.isSwiping = false;
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

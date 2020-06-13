import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { SwipeDirection, SwipeInfo } from '@spend-book/shared/model/helper-models';

@Directive({
  selector: '[appSwipeEvent]'
})
export class SwipeEventDirective {
  @Output() swipe = new EventEmitter<SwipeInfo>();
  @Output() endSwipe = new EventEmitter<number>();

  touchstartTime: number;
  percentage = 0;
  direction: SwipeDirection;

  touchStartX: number;
  touchStartY: number;

  touchEndX: number;
  touchEndY: number;

  resetSwipeStatus() {
    this.touchstartTime = 0;
    this.percentage = 0;
    this.direction = undefined;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].pageX;
    this.touchStartY = event.touches[0].pageY;
    this.touchstartTime = event.timeStamp;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (event.timeStamp - this.touchstartTime >= 100) {
      this.touchEndX = event.touches[0].pageX;
      this.touchEndY = event.touches[0].pageY;
      this.calculateSwipe();
      this.triggerWipe();
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.endSwipe.emit(this.percentage);
    this.resetSwipeStatus();
  }

  calculateSwipe() {
    if (Math.abs(this.touchEndY - this.touchStartY) <= 50 || this.direction !== undefined) {
      const diff: number = this.touchEndX - this.touchStartX;
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
  }

  triggerWipe() {
    this.swipe.emit({ direction: this.direction, percentage: this.percentage });
  }
}

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwipeDirection, SwipeInfo, SwipeResult } from '@spend-book/shared/model/helper-models';

@Component({
  selector: 'app-swipeable-item',
  templateUrl: './swipeable-item.component.html',
  styleUrls: ['./swipeable-item.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({})),
      state('out', style({})),
      transition('in => out', animate('0.2s ease-out', style({ transform: 'translateX(-100%)', height: 0 }))),
    ]),
    trigger('toggleSwipeActionIcon', [
      state('true', style({})),
      state('false', style({ transform: 'translateX(0)' })),
      transition('true => false', animate('0.2s ease-out'))
    ])
  ]
})
export class SwipeableItemComponent {
  readonly defaultSwipeDeleteThreshold = 0.2;

  @Input('swipeableItemDisabled') disabled = false;
  @Input('swipeDeleteThreshold') swipeDeleteThreshold: number = this.defaultSwipeDeleteThreshold;

  @Input() canSwipeLeft = true;
  @Input() swipeLeftColor = '#c84031';
  @Input() swipeLeftIcon = 'delete';

  @Input() canSwipeRight = false;
  @Input() swipeRightColor = '#3375e0';
  @Input() swipeRightIcon = 'info';

  @Output() swipeResult = new EventEmitter<SwipeResult>();

  flyInOutState = 'in';

  // cbkSwipe animation
  showSwipeIcon = false;
  widthPercentage = '0%';
  widthPercentageNumber = 0;
  swipeDirection: SwipeDirection;

  getTranslateXValue(): string {
    let direction = '';

    if (this.swipeDirection === 'left') {
      direction = '-';
    }

    return `translateX(${direction}${this.widthPercentage})`;
  }

  swipe(swipeInfo: SwipeInfo) {
    this.swipeDirection = swipeInfo.direction;

    if (this.canSwipeLeft && swipeInfo.direction === 'left') {
      this.swipeLeft(swipeInfo);
      return;
    }

    if (this.canSwipeRight && swipeInfo.direction === 'right') {
      this.swipeRight(swipeInfo);
      return;
    }
  }

  endSwipe(swipeInfo: SwipeInfo) {
    if (this.canSwipeLeft && swipeInfo.direction === 'left' && swipeInfo.percentage >= this.swipeDeleteThreshold) {
      this.playFlyOut();
      return;
    }
    if (this.canSwipeRight && swipeInfo.direction === 'right' && swipeInfo.percentage >= this.swipeDeleteThreshold) {
      this.swipeResult.emit({ direction: this.swipeDirection, result: true });
      this.reset();
      return;
    }

    this.cancelSwipe();
  }

  cancelSwipe() {
    this.showSwipeIcon = false;
    this.swipeResult.emit({ direction: this.swipeDirection, result: false });
    this.reset();
  }

  flyOutFinished(event) {
    if (event.triggerName === 'flyInOut' && event.toState === 'out') {
      this.swipeResult.emit({ direction: this.swipeDirection, result: true });
      this.flyInOutState = 'in';
      this.showSwipeIcon = false;
    }
    this.reset();
  }

  private swipeLeft(swipeInfo: SwipeInfo) {
    this.showSwipeIcon = true;
    this.widthPercentage = `${(swipeInfo.percentage * 100).toFixed(2)}%`;
    this.widthPercentageNumber = swipeInfo.percentage;
  }

  private swipeRight(swipeInfo: SwipeInfo) {
    this.showSwipeIcon = true;
    this.widthPercentage = `${(swipeInfo.percentage * 100).toFixed(2)}%`;
    this.widthPercentageNumber = swipeInfo.percentage;
  }

  private playFlyOut() {
    this.flyInOutState = 'out';
  }

  private reset() {
    this.widthPercentage = '0%';
    this.widthPercentageNumber = 0;
    this.swipeDirection = undefined;
  }

}

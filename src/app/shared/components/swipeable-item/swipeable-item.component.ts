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
    trigger('toggleSwipeDelete', [
      state('true', style({})),
      state('false', style({ transform: 'translateX(0)' })),
      transition('true => false', animate('0.1s ease-out'))
    ])
  ]
})
export class SwipeableItemComponent {
  readonly defaultSwipeDeleteThreshold = 0.2;
  @Input('swipeableItemDisabled') disabled = false;
  @Input('swipeDeleteThreshold') swipeDeleteThreshold: number = this.defaultSwipeDeleteThreshold;

  @Output() swipeResult = new EventEmitter<SwipeResult>();

  flyInOutState = 'in';

  // swipe animation
  showSwipeDelete = false;
  widthPercentage = '0%';
  widthPercentageNumber = 0;
  swipeDirection: SwipeDirection;

  getTranslateXValue(): string {
    return `translateX(-${this.widthPercentage})`;
  }

  swipe(swipeInfo: SwipeInfo) {
    this.swipeDirection = swipeInfo.direction;
    if (swipeInfo.direction === 'left') {
      this.swipeLeft(swipeInfo)
    }
  }

  endSwipe(swipeInfo: SwipeInfo) {
    if (swipeInfo.direction === 'left' && swipeInfo.percentage >= this.swipeDeleteThreshold) {
      this.playFlyOut();
    } else {
      this.cancelSwipe();
    }
  }

  cancelSwipe() {
    this.showSwipeDelete = false;
    this.swipeResult.emit({ direction: this.swipeDirection, result: false });
  }

  flyOutFinished(event) {
    if (event.triggerName === 'flyInOut' && event.toState === 'out') {
      this.swipeResult.emit({ direction: this.swipeDirection, result: true });
      this.flyInOutState = 'in';
      this.showSwipeDelete = false;
    }
  }

  private swipeLeft(swipeInfo: SwipeInfo) {
    this.showSwipeDelete = true;
    this.widthPercentage = `${(swipeInfo.percentage * 100).toFixed(2)}%`;
    this.widthPercentageNumber = swipeInfo.percentage;
  }

  private playFlyOut() {
    this.flyInOutState = 'out';
  }

}

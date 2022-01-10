import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appTouchDragEvent]'
})
export class TouchDragEventDirective {

  @Input() maxScale: number = 5;
  @Input() minScale: number = 1;

  @Input() initialWidth!: number;
  @Input() initialHeight!: number;
  @Input() initialLeft!: number;
  @Input() initialTop!: number;

  @Output() dragResult = new EventEmitter();

  translateXLeftLimit: number = 0;
  translateYUpperLimit: number = 0;

  translateXRightLimit: number = 0;
  translateYLowerLimit: number = 0;

  preTouchPosition: any = {};
  translateX = 0;
  translateY = 0;
  scaleRatio = 1;
  scaleOrigin = {
    x: 0,
    y: 0
  };
  preTouchesClientx1y1x2y2!: [number, number, number, number];
  originHaveSet = false;

  constructor(private img: ElementRef) {
  }

  @HostListener('touchstart', ['$event'])
  onTouchstart(e: any) {
    let touches = e.touches;
    if (touches.length > 1) {
      let one = touches['0'];
      let two = touches['1'];
      this.preTouchesClientx1y1x2y2 = [one.clientX, one.clientY, two.clientX, two.clientY];
      this.originHaveSet = false;
    }
    this.recordPreTouchPosition(touches['0']);
  };

  @HostListener('touchmove', ['$event'])
  onTouchmove(e: any) {
    let touches = e.touches;
    if (touches.length === 1) {
      let oneTouch = touches['0'];
      let translated = this.getTranslate(oneTouch.target);
      this.translateX = oneTouch.clientX - this.preTouchPosition.x + translated.left;
      this.translateY = oneTouch.clientY - this.preTouchPosition.y + translated.top;

      this.limitImageBorder();

      let matrix = `matrix(${this.scaleRatio}, 0, 0, ${this.scaleRatio}, ${this.translateX}, ${this.translateY})`;
      this.setStyle('transform', matrix);
      this.recordPreTouchPosition(oneTouch);
    } else {
      let one = touches['0'];
      let two = touches['1'];

      this.scaleRatio = this.distance(one.clientX, one.clientY, two.clientX, two.clientY) / this.distance(...this.preTouchesClientx1y1x2y2!) * this.scaleRatio || 1;
      if (this.scaleRatio > this.maxScale) {
        this.scaleRatio = this.maxScale;
      }
      if (this.scaleRatio < this.minScale) {
        this.scaleRatio = this.minScale;
      }
      if (!this.originHaveSet) {
        this.originHaveSet = true;
        // 移动视线中心
        let origin = this.relativeCoordinate((one.clientX + two.clientX) / 2, (one.clientY + two.clientY) / 2, this.img.nativeElement.getBoundingClientRect());
        // 修正视野变化带来的平移量
        this.translateX = (this.scaleRatio - 1) * (origin.x - this.scaleOrigin.x) + this.translateX;
        this.translateY = (this.scaleRatio - 1) * (origin.y - this.scaleOrigin.y) + this.translateY;

        this.setStyle('transform-origin', `${origin.x}px ${origin.y}px`);
        this.scaleOrigin = origin;
      }

      this.limitImageBorder();
      let matrix = `matrix(${this.scaleRatio}, 0, 0, ${this.scaleRatio}, ${this.translateX}, ${this.translateY})`;
      this.setStyle('transform', matrix);
      this.preTouchesClientx1y1x2y2 = [one.clientX, one.clientY, two.clientX, two.clientY];
    }
    e.preventDefault();
  }

  // 触摸点离开时更新最后位置
  @HostListener('touchend', ['$event'])
  onTouchend(e: TouchEvent) {
    let touches = e.touches;
    if (touches.length === 1) {
      this.recordPreTouchPosition(touches['0']);
    }


    this.dragResult.emit({
      scaleRatio: this.scaleRatio,
      translateX: this.translateX,
      translateY: this.translateY,
      scaleOriginX: this.scaleOrigin.x,
      scaleOriginY: this.scaleOrigin.y
    });

    // console.log('scaleRatio', this.scaleRatio);
    // console.log('translateX', this.translateX);
    // console.log('translateY', this.translateY);
  }

  @HostListener('touchcancel', ['$event'])
  ontouchcancel(e: TouchEvent) {
    let touches = e.touches;
    if (touches.length === 1) {
      this.recordPreTouchPosition(touches['0']);
    }
  }

  limitImageBorder() {
    this.translateXLeftLimit = (this.scaleRatio - 1) * this.scaleOrigin.x - this.initialLeft; // 已正确
    this.translateXRightLimit = -(this.scaleRatio - 1) * (this.initialWidth - this.scaleOrigin.x) + this.initialLeft;

    this.translateYUpperLimit = (this.scaleRatio - 1) * (this.scaleOrigin.y) - this.initialTop; // 已正确
    this.translateYLowerLimit = -(this.scaleRatio - 1) * (this.initialHeight - this.scaleOrigin.y) + this.initialTop; // 已正确

    if (this.translateY > this.translateYUpperLimit) {
      this.translateY = this.translateYUpperLimit;
    } else if (this.translateY < this.translateYLowerLimit) {
      this.translateY = this.translateYLowerLimit;
    }

    if (this.translateX > this.translateXLeftLimit) {
      this.translateX = this.translateXLeftLimit;
    } else if (this.translateX < this.translateXRightLimit) {
      this.translateX = this.translateXRightLimit;
    }
  }

  getStyle(target: Element, style: string) {
    let styles = window.getComputedStyle(target, null);
    return styles.getPropertyValue(style);
  }

  getTranslate(target: Element) {
    let matrix = this.getStyle(target, 'transform');
    let nums = matrix.substring(7, matrix.length - 1).split(', ');
    let left = parseInt(nums[4]) || 0;
    let top = parseInt(nums[5]) || 0;
    return {
      left: left,
      top: top
    };
  }

  recordPreTouchPosition(touch: any) {
    this.preTouchPosition = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  relativeCoordinate(x: number, y: number, rect: {left: number, top: number}) {
    let cx = (x - rect.left) / this.scaleRatio;
    let cy = (y - rect.top) / this.scaleRatio;
    return {
      x: cx,
      y: cy
    };
  }

  setStyle(key: string, value: string | number) {
    this.img.nativeElement.style[key] = value;
  }

  distance(x1: number, y1: number, x2: number, y2: number) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }
}

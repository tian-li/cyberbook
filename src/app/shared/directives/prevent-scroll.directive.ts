import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventScroll]'
})
export class PreventScrollDirective {
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
  }
}

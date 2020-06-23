import {
  animation, trigger, animateChild, group,
  transition, animate, style, query, state
} from '@angular/animations';

export const rotateAddButtonAnimation =trigger('rotateAddButton', [
  state('open', style({ transform: 'rotate(135deg)' })),
  state('closed', style({ transform: 'rotate(0)' })),
  transition('closed => open', animate('0.2s ease')),
  transition('open => closed', animate('0.2s ease')),
]);

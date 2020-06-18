import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeableItemComponent } from './swipeable-item.component';

describe('SwipeabaleItemComponent', () => {
  let component: SwipeableItemComponent;
  let fixture: ComponentFixture<SwipeableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

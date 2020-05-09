import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDividerComponent } from './date-divider.component';

describe('DateDividerComponent', () => {
  let component: DateDividerComponent;
  let fixture: ComponentFixture<DateDividerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateDividerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

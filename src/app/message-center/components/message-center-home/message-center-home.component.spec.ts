import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCenterHomeComponent } from './message-center-home.component';

describe('MessageCenterHomeComponent', () => {
  let component: MessageCenterHomeComponent;
  let fixture: ComponentFixture<MessageCenterHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageCenterHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCenterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

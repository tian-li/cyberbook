import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageThreadItemComponent } from './message-thread-item.component';

describe('MessageThreadItemComponent', () => {
  let component: MessageThreadItemComponent;
  let fixture: ComponentFixture<MessageThreadItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageThreadItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageThreadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

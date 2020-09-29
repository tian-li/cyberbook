import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageThreadListComponent } from './message-thread-list.component';

describe('MessageThreadListComponent', () => {
  let component: MessageThreadListComponent;
  let fixture: ComponentFixture<MessageThreadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageThreadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageThreadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringManagementComponent } from './recurring-management.component';

describe('RecurringManagementComponent', () => {
  let component: RecurringManagementComponent;
  let fixture: ComponentFixture<RecurringManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphHomeComponent } from './graph-home.component';

describe('GraphHomeComponent', () => {
  let component: GraphHomeComponent;
  let fixture: ComponentFixture<GraphHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

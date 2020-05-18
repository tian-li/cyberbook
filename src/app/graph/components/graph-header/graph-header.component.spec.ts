import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphHeaderComponent } from './graph-header.component';

describe('BookHeaderComponent', () => {
  let component: GraphHeaderComponent;
  let fixture: ComponentFixture<GraphHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

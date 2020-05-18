import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphChartsComponent } from './graph-charts.component';

describe('GraphChartsComponent', () => {
  let component: GraphChartsComponent;
  let fixture: ComponentFixture<GraphChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

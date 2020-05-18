import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphChartPieComponent } from './graph-chart-pie.component';

describe('GraphChartPieComponent', () => {
  let component: GraphChartPieComponent;
  let fixture: ComponentFixture<GraphChartPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphChartPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphChartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-graph-header',
  templateUrl: './graph-header.component.html',
})
export class GraphHeaderComponent {
  readonly chartTypes = [
    { value: 'line', display: '趋势' },
    { value: 'pie', display: '比例' },
  ];

  @Output() chartTypeChanged = new EventEmitter<string>();

  typeSwitcherConfig = {
    enabled: true,
    types: this.chartTypes
  };

  changeCartType(chartType: string | boolean) {
    this.chartTypeChanged.emit(<string>chartType);
  }
}

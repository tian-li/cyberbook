import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphHeaderComponent } from '@spend-book/graph/components/graph-header/graph-header.component';
import { GraphRoutingModule } from '@spend-book/graph/graph-routing.module';
import { SharedModule } from '@spend-book/shared/shared.module';
import { GraphHomeComponent } from './components/graph-home/graph-home.component';
import { GraphChartsComponent } from './components/graph-charts/graph-charts.component';
import { GraphChartPieComponent } from './components/graph-chart-pie/graph-chart-pie.component';


@NgModule({
  declarations: [
    GraphHomeComponent,
    GraphHeaderComponent,
    GraphChartsComponent,
    GraphChartPieComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GraphRoutingModule,
    FormsModule
  ]
})
export class GraphModule {
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphHeaderComponent } from '@cyberbook/graph/components/graph-header/graph-header.component';
import { GraphRoutingModule } from '@cyberbook/graph/graph-routing.module';
import { SharedModule } from '@cyberbook/shared/shared.module';
import { LoadDataResolver } from '../core/reslovers/load-data.resolver';
import { GraphChartLineComponent } from './components/graph-chart-line/graph-chart-line.component';
import { GraphChartPieComponent } from './components/graph-chart-pie/graph-chart-pie.component';
import { GraphHomeComponent } from './components/graph-home/graph-home.component';


@NgModule({
  declarations: [
    GraphHomeComponent,
    GraphHeaderComponent,
    GraphChartLineComponent,
    GraphChartPieComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GraphRoutingModule,
    FormsModule
  ],
  providers:[
    LoadDataResolver
  ]
})
export class GraphModule {
}

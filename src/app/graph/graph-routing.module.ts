import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GraphChartPieComponent } from '@spend-book/graph/components/graph-chart-pie/graph-chart-pie.component';
import { GraphHomeComponent } from '@spend-book/graph/components/graph-home/graph-home.component';

const routes: Routes = [
  {
    path: '',
    component: GraphHomeComponent,
  },
  {
    path: 'pie',
    component: GraphChartPieComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphRoutingModule {}

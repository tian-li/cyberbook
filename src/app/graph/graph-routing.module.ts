import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GraphChartLineComponent } from '@spend-book/graph/components/graph-chart-line/graph-chart-line.component';
import { GraphChartPieComponent } from '@spend-book/graph/components/graph-chart-pie/graph-chart-pie.component';
import { GraphHomeComponent } from '@spend-book/graph/components/graph-home/graph-home.component';

const routes: Routes = [
  {
    path: '',
    component: GraphHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'line',
        pathMatch: 'full'
      },
      {
        path: 'pie',
        component: GraphChartPieComponent
      },
      {
        path: 'line',
        component: GraphChartLineComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphRoutingModule {}
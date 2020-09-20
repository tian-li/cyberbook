import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphChartLineComponent } from '@cyberbook/graph/components/graph-chart-line/graph-chart-line.component';
import { GraphChartPieComponent } from '@cyberbook/graph/components/graph-chart-pie/graph-chart-pie.component';
import { GraphHomeComponent } from '@cyberbook/graph/components/graph-home/graph-home.component';
import { LoadDataResolver } from '../core/reslovers/load-data.resolver';

const routes: Routes = [
  {
    path: '',
    component: GraphHomeComponent,
    resolve: { data: LoadDataResolver },
    children: [
      {
        path: '',
        redirectTo: 'pie',
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
export class GraphRoutingModule {
}

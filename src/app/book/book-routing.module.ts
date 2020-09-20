import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadDataResolver } from '../core/reslovers/load-data.resolver';
import { BookHomeComponent } from './components/book-home/book-home.component';

const routes: Routes = [
  {
    path: '',
    component: BookHomeComponent,
    resolve: { data: LoadDataResolver },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule {
}

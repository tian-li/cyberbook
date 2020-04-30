import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BookHomeComponent } from './components/book-home/book-home.component';

const routes: Routes = [
  {
    path: '',
    component: BookHomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule {}

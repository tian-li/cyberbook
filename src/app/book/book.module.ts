import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BookHomeComponent } from './components/book-home/book-home.component';
import { BookRoutingModule } from './book-routing.module';

@NgModule({
  declarations: [BookHomeComponent],
  imports: [
    CommonModule,
    BookRoutingModule
  ]
})
export class BookModule { }

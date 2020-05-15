import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BookRoutingModule } from './book-routing.module';
import { BookHeaderComponent } from './components/book-header/book-header.component';
import { BookHomeComponent } from './components/book-home/book-home.component';
import { DateDividerComponent } from './components/date-divider/date-divider.component';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { YearMonthPickerComponent } from './components/year-month-picker/year-month-picker.component';

@NgModule({
  declarations: [
    BookHomeComponent,
    TransactionListComponent,
    TransactionItemComponent,
    DateDividerComponent,
    BookHeaderComponent,
    YearMonthPickerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BookRoutingModule,
  ],

  entryComponents: [
    YearMonthPickerComponent,
  ]
})
export class BookModule {
}

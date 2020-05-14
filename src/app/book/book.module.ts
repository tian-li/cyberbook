import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { BookRoutingModule } from './book-routing.module';
import { BookHeaderComponent } from './components/book-header/book-header.component';
import { BookHomeComponent } from './components/book-home/book-home.component';
import { DateDividerComponent } from './components/date-divider/date-divider.component';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { YearMonthPickerComponent } from './components/year-month-picker/year-month-picker.component';
import { BookService } from './services/book.service';
import { CategoryService } from './services/category.service';
import { TransactionService } from './services/transaction.service';
import { reducers, spendBookFeatureKey } from './store';
import { BookEffects } from './store/book/book.effects';
import { CategoryEffects } from './store/category/category.effects';
import { TransactionEffects } from './store/transaction/transaction.effects';


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
    StoreModule.forFeature(spendBookFeatureKey, reducers),
    EffectsModule.forFeature([BookEffects, CategoryEffects, TransactionEffects]),
  ],
  providers: [
    BookService,
    CategoryService,
    TransactionService,
  ],
  entryComponents: [
    YearMonthPickerComponent,
  ]
})
export class BookModule {
}

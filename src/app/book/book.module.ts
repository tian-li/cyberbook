import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BookRoutingModule } from './book-routing.module';
import { BookHomeComponent } from './components/book-home/book-home.component';
import { BookService } from './services/book.service';
import { CategoryService } from './services/category.service';
import { TransactionService } from './services/transaction.service';
import { reducers, spendBookFeatureKey } from './store';
import { BookEffects } from './store/book/book.effects';
import { CategoryEffects } from './store/category/category.effects';
import { TransactionEffects } from './store/transaction/transaction.effects';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';
import { DateDividerComponent } from './components/date-divider/date-divider.component';


@NgModule({
  declarations: [BookHomeComponent, TransactionListComponent, TransactionItemComponent, DateDividerComponent],
  imports: [
    CommonModule,
    BookRoutingModule,
    StoreModule.forFeature(spendBookFeatureKey, reducers),
    EffectsModule.forFeature([BookEffects, CategoryEffects, TransactionEffects]),
  ],
  providers: [
    BookService,
    CategoryService,
    TransactionService
  ]
})
export class BookModule {
}

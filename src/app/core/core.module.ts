import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BookService } from '@spend-book/core/services/book.service';
import { CategoryService } from '@spend-book/core/services/category.service';
import { PwaService } from '@spend-book/core/services/pwa.service';
import { SubscriptionService } from '@spend-book/core/services/subscription.service';
import { TransactionService } from '@spend-book/core/services/transaction.service';
import { UserService } from '@spend-book/core/services/user.service';
import { ROOT_REDUCERS } from '@spend-book/core/store';
import { BookEffects } from '@spend-book/core/store/book/book.effects';
import { CategoryEffects } from '@spend-book/core/store/category/category.effects';
import { NotificationEffects } from '@spend-book/core/store/notification/notification.effects';
import { SubscriptionEffects } from '@spend-book/core/store/subscription/subscription.effects';
import { TransactionEffects } from '@spend-book/core/store/transaction/transaction.effects';
import { UserEffects } from '@spend-book/core/store/user/user.effects';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
        // metaReducers,
        runtimeChecks: {
          // strictStateImmutability and strictActionImmutability are enabled by default
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
        }
      }
    ),
    EffectsModule.forRoot([
      UserEffects,
      NotificationEffects,
      BookEffects,
      CategoryEffects,
      TransactionEffects,
      SubscriptionEffects
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
        name: 'Spend Book'
      })
  ],
  providers: [
    BookService,
    CategoryService,
    TransactionService,
    SubscriptionService,
    UserService,
    PwaService
  ],
  declarations: []
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

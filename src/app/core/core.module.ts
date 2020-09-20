import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BookService } from '@cyberbook/core/services/book.service';
import { CategoryService } from '@cyberbook/core/services/category.service';
import { PwaService } from '@cyberbook/core/services/pwa.service';
import { SubscriptionService } from '@cyberbook/core/services/subscription.service';
import { TransactionService } from '@cyberbook/core/services/transaction.service';
import { UserService } from '@cyberbook/core/services/user.service';
import { ROOT_REDUCERS } from '@cyberbook/core/store';
import { CategoryEffects } from '@cyberbook/core/store/category/category.effects';
import { NotificationEffects } from '@cyberbook/core/store/notification/notification.effects';
import { SubscriptionEffects } from '@cyberbook/core/store/subscription/subscription.effects';
import { TransactionEffects } from '@cyberbook/core/store/transaction/transaction.effects';
import { UserEffects } from '@cyberbook/core/store/user/user.effects';
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

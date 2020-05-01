import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';
import { AppState, reducers, selectRouterState } from './core.state';
import { AuthGuardService } from './guards/auth-guard.service';
import { authLogin, authLogout } from './store/auth/auth.actions';
import { AuthEffects } from './store/auth/auth.effects';
import { selectAuth, selectIsAuthenticated } from './store/auth/auth.selectors';
import { notifyWithSnackBar } from './store/notification/notification.actions';
import { NotificationEffects } from './store/notification/notification.effects';

export { selectAuth, authLogin, authLogout, AppState, selectIsAuthenticated, AuthGuardService, selectRouterState, notifyWithSnackBar };

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // ngrx
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects, NotificationEffects]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
        name: 'Spend Book'
      })
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

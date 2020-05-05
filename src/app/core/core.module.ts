import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
// import { AuthGuardService } from './guards/auth-guard.service';
// import { authLogin, authLogout } from './store/auth/auth.actions';
// import { selectAuth, selectIsAuthenticated } from './store/auth/auth.selectors';
// // import { AppState, selectRouterState } from './store';
// import { notifyWithSnackBar } from './store/notification/notification.actions';


@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // // ngrx
    // StoreModule.forRoot(reducers),
    // EffectsModule.forRoot([AuthEffects, NotificationEffects]),
    // environment.production
    //   ? []
    //   : StoreDevtoolsModule.instrument({
    //     name: 'Spend Book'
    //   })
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

import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf, ErrorHandler } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { environment } from "../../environments/environment";

import {
  AppState,
  reducers,
  selectRouterState
} from "./core.state";
import { AuthEffects } from "./auth/auth.effects";
import { selectIsAuthenticated, selectAuth } from "./auth/auth.selectors";
import { authLogin, authLogout } from "./auth/auth.actions";
import { AuthGuardService } from "./auth/auth-guard.service";

export {
  selectAuth,
  authLogin,
  authLogout,
  AppState,
  selectIsAuthenticated,
  AuthGuardService,
  selectRouterState
};


@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // ngrx
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: "Cost Book"
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
      throw new Error("CoreModule is already loaded. Import only in AppModule");
    }
  }
}

import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../../environments/environment";
import { AuthGuardService } from "./auth/auth-guard.service";
import { authLogin, authLogout } from "./auth/auth.actions";
import { AuthEffects } from "./auth/auth.effects";
import { selectAuth, selectIsAuthenticated } from "./auth/auth.selectors";
import { AppState, reducers, selectRouterState } from "./core.state";

export { selectAuth, authLogin, authLogout, AppState, selectIsAuthenticated, AuthGuardService, selectRouterState };

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

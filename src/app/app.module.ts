import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthEffects } from './core/store/auth/auth.effects';
import { NotificationEffects } from './core/store/notification/notification.effects';
import { metaReducers, ROOT_REDUCERS } from './reducers';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    // ngrx
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
    EffectsModule.forRoot([AuthEffects, NotificationEffects]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
        name: 'Spend Book'
      })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

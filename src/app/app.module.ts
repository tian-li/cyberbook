import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoLoginGuard } from '@spend-book/core/guards/auto-login.guard';
import { LoadDataResolver } from '@spend-book/core/reslovers/load-data.resolver';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
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
    CoreModule
  ],
  providers: [AutoLoginGuard, LoadDataResolver],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { CanRegisterGuard } from '@spend-book/user/guards/can-register.guard';
import { SharedModule } from '../shared/shared.module';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserComponent } from './components/user/user.component';
import { UserRoutingModule } from './user-routing.module';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { ManageCategoriesComponent } from './components/manage-categories/manage-categories.component';

@NgModule({
  declarations: [
    AuthenticateComponent,
    ProfileComponent,
    UserHomeComponent,
    UserComponent,
    ThemeSelectorComponent,
    ManageCategoriesComponent
  ],
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  providers: [
    CanRegisterGuard
  ]
})
export class UserModule {
}

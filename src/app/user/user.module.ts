import { NgModule } from '@angular/core';
import { CanRegisterGuard } from '@cyberbook/user/guards/can-register.guard';
import { LoadDataResolver } from '../core/reslovers/load-data.resolver';
import { SharedModule } from '../shared/shared.module';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { CategoryEditorComponent } from './components/category-editor/category-editor.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionEditorComponent } from './components/subscription-editor/subscription-editor.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserComponent } from './components/user/user.component';
import { UserRoutingModule } from './user-routing.module';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { ManageCategoriesComponent } from './components/manage-categories/manage-categories.component';
import { SubscriptionManagementComponent } from './components/subscription-management/subscription-management.component';

@NgModule({
  declarations: [
    AuthenticateComponent,
    ProfileComponent,
    UserHomeComponent,
    UserComponent,
    ThemeSelectorComponent,
    ManageCategoriesComponent,
    SubscriptionManagementComponent,
    CategoryEditorComponent,
    SubscriptionEditorComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  providers: [
    CanRegisterGuard,
    LoadDataResolver
  ],
  entryComponents: [
    CategoryEditorComponent,
    SubscriptionEditorComponent
  ]
})
export class UserModule {
}

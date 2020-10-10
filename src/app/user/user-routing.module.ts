import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCategoriesComponent } from '@cyberbook/user/components/manage-categories/manage-categories.component';
import { ThemeSelectorComponent } from '@cyberbook/user/components/theme-selector/theme-selector.component';
import { CanRegisterGuard } from '@cyberbook/user/guards/can-register.guard';
import { LoadDataResolver } from '../core/reslovers/load-data.resolver';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { ProfileComponent } from './components/profile/profile.component';
import {
  SubscriptionManagementComponent
} from './components/subscription-management/subscription-management.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserComponent } from './components/user/user.component';
import { CanLeaveAuthGuard } from './guards/can-leave-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    resolve: { data: LoadDataResolver },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserHomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'theme',
        component: ThemeSelectorComponent,
      },
      {
        path: 'register',
        component: AuthenticateComponent,
        data: { registerMode: true },
        canActivate: [CanRegisterGuard],
        canDeactivate: [CanLeaveAuthGuard]
      },
      {
        path: 'login',
        component: AuthenticateComponent,
        data: { registerMode: false },
        canActivate: [CanRegisterGuard],
        canDeactivate: [CanLeaveAuthGuard]
      },
      {
        path: 'category-management',
        component: ManageCategoriesComponent,
      },
      {
        path: 'subscription-management',
        component: SubscriptionManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}

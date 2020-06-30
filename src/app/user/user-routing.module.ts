import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCategoriesComponent } from '@spend-book/user/components/manage-categories/manage-categories.component';
import { ThemeSelectorComponent } from '@spend-book/user/components/theme-selector/theme-selector.component';
import { CanRegisterGuard } from '@spend-book/user/guards/can-register.guard';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionManagementComponent } from './components/subscription-management/subscription-management.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserHomeComponent,
      },
    ]
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
    path: 'authenticate',
    component: AuthenticateComponent,
    canActivate: [CanRegisterGuard]
  },
  {
    path: 'category-management',
    component: ManageCategoriesComponent,
  },
  {
    path: 'subscription-management',
    component: SubscriptionManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}

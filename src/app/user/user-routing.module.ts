import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanRegisterGuard } from '@spend-book/user/guards/can-register.guard';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { ProfileComponent } from './components/profile/profile.component';
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
    path: 'authenticate',
    component: AuthenticateComponent,
    canActivate: [CanRegisterGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}

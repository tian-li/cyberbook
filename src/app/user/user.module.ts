import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserComponent } from './components/user/user.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserHomeComponent,
    UserComponent
  ],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule {
}

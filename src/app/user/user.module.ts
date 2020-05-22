import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserRoutingModule } from './user-routing.module';
import { UserHomeComponent } from './components/user-home/user-home.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, UserHomeComponent],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }

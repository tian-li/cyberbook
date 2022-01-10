import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CanRegisterGuard } from '@cyberbook/user/guards/can-register.guard';
import { LoadDataResolver } from '../core/reslovers/load-data.resolver';
import { SharedModule } from '../shared/shared.module';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { CategoryEditorComponent } from './components/category-editor/category-editor.component';
import { ManageCategoriesComponent } from './components/manage-categories/manage-categories.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionEditorComponent } from './components/subscription-editor/subscription-editor.component';
import { SubscriptionManagementComponent } from './components/subscription-management/subscription-management.component';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserComponent } from './components/user/user.component';
import { CanLeaveAuthGuard } from './guards/can-leave-auth.guard';
import { UserRoutingModule } from './user-routing.module';

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
        UserRoutingModule,
        FormsModule
    ],
    providers: [
        CanRegisterGuard,
        LoadDataResolver,
        CanLeaveAuthGuard
    ]
})
export class UserModule {
}

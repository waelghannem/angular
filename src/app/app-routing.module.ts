import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrderComponent} from './feature/components/order/order.component';
import {HomeComponent} from './feature/components/home/home.component';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {LoginComponent} from "./feature/components/login/login.component";
import {AuthGuard} from "./core/auth.guard";
import {ProfileComponent} from './feature/components/profile/profile.component';
import {MyAccountComponent} from './feature/components/profile/my-account/my-account.component';
import {CompanyComponent} from './feature/components/profile/company/company.component';
import {PasswordComponent} from './feature/components/profile/password/password.component';
import {SettingsComponent} from './feature/components/profile/settings/settings.component';
import {NotificationComponent} from './feature/components/profile/notification/notification.component';
import {CompanyAdressesComponent} from './feature/components/profile/company-adresses/company-adresses.component';
import {
  PartnerBankAccountsComponent
} from "./feature/components/profile/partner-bank-accounts/partner-bank-accounts.component";
import { SsoAuthenticationComponent } from './core/sso-authentication/sso-authentication.component';

const routes: Routes = [
  /* { path: '', redirectTo: 'home', pathMatch: 'full'},
   { path: '**', component: PageNotFoundComponent }*/
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'orders', component: OrderComponent, canActivate: [AuthGuard]},
  {
    path: 'profile', component: ProfileComponent, children: [
      {path: 'myAccount', component: MyAccountComponent},
      {path: 'myCompanyInformation', component: CompanyComponent},
      {path: 'myPassword', component: PasswordComponent},
      {path: 'mySettings', component: SettingsComponent},
      {path: 'myNotification', component: NotificationComponent},
      {path: 'bankDetailsPartnerv2', component: PartnerBankAccountsComponent},
      {path: 'companyAddresses', component: CompanyAdressesComponent}
    ]
    , canActivate: [AuthGuard]
  },


  {path: 'login', component: LoginComponent},
  {path: 'sso', component: SsoAuthenticationComponent},
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

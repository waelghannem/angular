import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './components/order/order.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {ProfileComponent} from './components/profile/profile.component';
import {MyAccountComponent} from './components/profile/my-account/my-account.component';
import {NotificationComponent} from './components/profile/notification/notification.component';
import {PasswordComponent} from './components/profile/password/password.component';
import {SettingsComponent} from './components/profile/settings/settings.component';
import {CompanyComponent} from './components/profile/company/company.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatNativeDateModule} from "@angular/material/core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CompanyAdressesComponent} from './components/profile/company-adresses/company-adresses.component';
import {DropdownModule} from "primeng/dropdown";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {ListboxModule} from "primeng/listbox";
import {AngularIbanModule} from "angular-iban";
import {DialogModule} from 'primeng/dialog';

import {SharedModule} from '../shared/shared.module';
import {NgxIbanModule} from "ngx-iban";
import {TableModule} from "primeng/table";
import {MenuModule} from "primeng/menu";
import {TieredMenuModule} from "primeng/tieredmenu";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {PartnerBankAccountsComponent} from './components/profile/partner-bank-accounts/partner-bank-accounts.component';
import {CalendarModule} from "primeng/calendar";
import {SliderModule} from "primeng/slider";
import {ContextMenuModule} from "primeng/contextmenu";
import {ToastModule} from "primeng/toast";
import {ProgressBarModule} from "primeng/progressbar";
import {FileUploadModule} from "primeng/fileupload";
import {ToolbarModule} from "primeng/toolbar";
import {RatingModule} from "primeng/rating";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RadioButtonModule} from "primeng/radiobutton";
import {BrowserModule} from "@angular/platform-browser";
import {MultiSelectModule} from "primeng/multiselect";
import {ConfirmationService, MessageService} from "primeng/api";
import {CustomDatePipe} from "../core/custom.datepipe";
import {PanelMenuModule} from "primeng/panelmenu";
import {AvatarModule} from "primeng/avatar";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {DividerModule} from "primeng/divider";
import { CheckboxModule } from 'primeng/checkbox';
import {InputMaskModule} from "primeng/inputmask";
import {SelectButtonModule} from "primeng/selectbutton";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    OrderComponent,
    ProfileComponent,
    MyAccountComponent,
    NotificationComponent,
    PasswordComponent,
    SettingsComponent,
    CompanyComponent,
    CompanyAdressesComponent,
    PartnerBankAccountsComponent,
    CustomDatePipe,
    ResetPasswordComponent,
    ResetPasswordComponent,
  ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatIconModule,
        MatNativeDateModule,
        SharedModule,
        FontAwesomeModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        ListboxModule,
        AngularIbanModule,
        NgxIbanModule,
        MenuModule,
        TieredMenuModule,
        ConfirmDialogModule,
        BrowserModule,
        BrowserAnimationsModule,
        TableModule,
        CalendarModule,
        SliderModule,
        DialogModule,
        MultiSelectModule,
        ContextMenuModule,
        DropdownModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        ProgressBarModule,
        FileUploadModule,
        ToolbarModule,
        RatingModule,
        RadioButtonModule,
        InputNumberModule,
        InputTextareaModule,
        PanelMenuModule,
        AvatarModule,
        PanelModule,
        PasswordModule,
        DividerModule,
        CheckboxModule,
        InputMaskModule,
        SelectButtonModule,

    ],
    exports: [
        OrderComponent,
        PasswordComponent,
        ResetPasswordComponent,
    ],
  providers: [MessageService, ConfirmationService]
})
export class FeatureModule {
}

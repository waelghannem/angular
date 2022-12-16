import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from "@angular/material/icon";
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {FeatureModule} from './feature/feature.module';
import {BlocksModule} from './blocks/blocks.module';
import {AppRoutingModule} from './app-routing.module';
import {EnvConfigurationService} from './env-configuration.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BreadcrumbComponent} from './shared/breadcrumb/breadcrumb.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from "./feature/components/home/home.component";
import {LoginComponent} from "./feature/components/login/login.component";
import {BasicAuthInterceptor} from "./core/interceptors/basic-auth.interceptor";
import {ErrorInterceptor} from "./core/interceptors/error.interceptor";
import {HeaderComponent} from './front-header/header.component';
import {ToastNotificationComponent} from './shared/toast-notification/toast-notification.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {InputTextModule} from "primeng/inputtext";
import {PanelMenuModule} from "primeng/panelmenu";
import {AvatarModule} from "primeng/avatar";
import {PanelModule} from "primeng/panel";
import {MenubarModule} from "primeng/menubar";
import {MenuModule} from "primeng/menu";
import {TieredMenuModule} from "primeng/tieredmenu";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ListboxModule} from "primeng/listbox";
import {AngularIbanModule} from "angular-iban";
import {NgxIbanModule} from "ngx-iban";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableModule} from "primeng/table";
import {CalendarModule} from "primeng/calendar";
import {SliderModule} from "primeng/slider";
import {DialogModule} from "primeng/dialog";
import {MultiSelectModule} from "primeng/multiselect";
import {ContextMenuModule} from "primeng/contextmenu";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {ProgressBarModule} from "primeng/progressbar";
import {FileUploadModule} from "primeng/fileupload";
import {ToolbarModule} from "primeng/toolbar";
import {RatingModule} from "primeng/rating";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FooterComponent} from './footer/footer.component';
import {SafePipe} from './safe.pipe';
import {StepsModule} from "primeng/steps";
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { ForgotPasswordComponent } from './feature/components/forgot-password/forgot-password.component';
import {ImageModule} from "primeng/image";
import {ProgressSpinnerModule} from "primeng/progressspinner";


@NgModule({
    declarations: [
        AppComponent,
        BreadcrumbComponent,
        ToastNotificationComponent,
        HomeComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        SafePipe,
        ForgotPasswordComponent,

    ],
  imports: [
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    CoreModule,
    SharedModule,
    FeatureModule,
    BlocksModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    InputTextModule,
    PanelMenuModule,
    AvatarModule,
    PanelModule,
    MenubarModule,
    MenuModule,
    TieredMenuModule,
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    ListboxModule,
    AngularIbanModule,
    NgxIbanModule,
    ConfirmDialogModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    ProgressBarModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextareaModule,
    StepsModule,
    BreadcrumbModule,
    ImageModule,
    ProgressSpinnerModule

  ],
  providers: [
    //{provide: HTTP_INTERCEPTORS,useClass: TokenInterceptorService, multi: true,},
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    // provider used to create fake backend
    //fakeBackendProvider,
    {provide: APP_INITIALIZER, useFactory: (envConfigService: EnvConfigurationService) => () => envConfigService.load().toPromise(), deps: [EnvConfigurationService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

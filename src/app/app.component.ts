import {Component, OnInit} from '@angular/core';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import packageJson from '../../package.json';
import {AuthenticationService} from "./core/services/authentication.service";
import {User} from "./core/model/user";
import {AppService} from "./shared/breadcrumb/app.service";
import { ToastType } from './shared/models/toastType';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public version: string = packageJson.version;
  title = 'aio-front';
  faCoffee = faCoffee;
  currentUser: User;
  userLoggedIn: boolean;
  showTost: boolean =false;
  ToastType = ToastType;
  message: string;
  type: ToastType;
  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private appService: AppService) {
  }


  ngOnInit(): void {

    this.userLoggedIn = false;
    this.appService.toast.subscribe(toastPayload => {
      this.type = toastPayload.type
      this.message = toastPayload.message
      setTimeout(() => {
        this.type = ToastType.NONE
        this.message = ""
      }, 2000)
    })

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  showToster() {
    this.showTost = !this.showTost;
  }

  isLoggedIn() {
    this.userLoggedIn = this.authenticationService.isLoggedIn();
    return this.userLoggedIn;
  }


}

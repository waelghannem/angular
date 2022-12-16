import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from "../model/user";
import {environment} from "../../../environments/environment";
import jwt_decode from "jwt-decode";
import {JwtHelperService} from "@auth0/angular-jwt";
import {EnvConfigurationService} from "../../env-configuration.service";
import {ApiConnectorService} from './api-connector.service';
import {Jwt} from '../model/Jwt';
import {ThemeService} from "../../feature/services/themeService";
import {defaultTheme} from "../../shared/constants";

interface LoginDto {
  Login: { username: string, password: string }
}

interface CaptchaDto {
  Captcha: { captchaValue: string, captchaTypeImage: boolean }
}

interface JwtDto {
  Jwt: Jwt
}

const httpOptions = {}

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<User>;
  // @ts-ignore
  public refreshTokenTimeout: string | number | NodeJS.Timeout | undefined
  api!: String;

  constructor(private apiConnector: ApiConnectorService, private http: HttpClient, private envConfigurationService: EnvConfigurationService, private themeService: ThemeService) {
    /*TODO create a generic methode to do post using the uri get from json file*/
    this.api = `${environment.apiUrl}`
    this.envConfigurationService.load().subscribe(conf => {
      this.api = conf.apiUrl ? conf.apiUrl : this.api;
    })
    const userJson = localStorage.getItem('currentUser');
    const currentUserTemps = userJson !== null ? JSON.parse(userJson) : new User();
    this.currentUserSubject = new BehaviorSubject<User>(currentUserTemps)
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.api + "/login", {Login: {username, password}})
      .pipe(map(user => {
        let userObj: User = jwt_decode(user.accessToken);
        user.user = userObj;
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        //user.accessToken = window.btoa(username + ':' + password);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // @ts-ignore
    this.currentUserSubject.next(null);
    this.themeService.switchTheme(defaultTheme)
  }

  public isLoggedIn(): boolean {
    if (this.currentUserSubject.getValue() && this.currentUserSubject.getValue().accessToken && Date.now() < this.getExpiration().getTime())
      return true;
    return false;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.currentUserSubject.getValue().accessToken);
    const expires = new Date(decodedToken.exp * 1000);
    return expires;
  }

  refreshToken() {
    return this.http.post<any>(`${environment.apiUrl}/users/refresh-token`, {}, {withCredentials: true})
      .pipe(map((user) => {
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  redirectSSO() {
    return this.apiConnector.getAsText("/sso");
  }

  // helper methods

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const helper = new JwtHelperService();
    const jwtToken = helper.decodeToken(this.currentUserSubject.getValue().accessToken);
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }


  tokenRefresh(jwt: JwtDto) {
    return this.apiConnector.post<any>("/refreshToken", jwt);
  }

  validateCaptcha(captchaValue: string, captchaTypeImage: boolean) {
    return this.http.post<any>(this.api + "/validateImage", {Captcha: {captchaValue, captchaTypeImage}})
      .pipe(map(response => {
        let captchaStatus: String = response;
        return captchaStatus;
      }));
  }

  refreshCaptcha(captchaValue: string, captchaTypeImage: boolean) {
    return this.http.post<any>(this.api + "/refreshCaptcha", {Captcha: {captchaValue, captchaTypeImage}})
      .pipe(map(response => {
        let captchaStatus: String = response;
        return captchaStatus;
      }));
  }
}

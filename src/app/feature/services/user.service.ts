import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiConnectorService } from 'src/app/core/services/api-connector.service';
import { Parameter } from '../models/parameter';
import { Password } from '../models/password';
import { ProfileUser } from '../models/profileUser';
import { UserNotification } from '../models/userNotification';
import {HttpParams} from "@angular/common/http";

export interface userDto {
  User: ProfileUser
}

interface ParameterDto {
  Parameter: Parameter
}

interface PasswordDto {
  Password: Password
}

interface NotificationDto {
  Notification: UserNotification
}

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private apiConnector: ApiConnectorService) { }

  url = "/user";
  passwordUrl = "/changePassword";
  parameterUrl = "/parameters";
  notificationUrl = "/user/notifications"
  passwordForgottenUrl = "/user/passwordForgotten/sendLink"
  resetPasswordUrl =  "/user/passwordForgotten/reset"
  passwordValidatorUrl = "/user/password/pattern"

  resetLinkValidityUrl = "/user/passwordForgotten/check-reset-link-validity"
  private user:Subject<ProfileUser> = new Subject<ProfileUser>();

  getUser(): Observable<ProfileUser> {
    return this.apiConnector.get<ProfileUser>(this.url);
  }

  getParameters(): Observable<Parameter> {
    return this.apiConnector.get<Parameter>(this.parameterUrl)
  }
  sendForgotPasswordRequest(login: string) {
    return this.apiConnector.getAsText(this.passwordForgottenUrl+"?login="+login);
  }

  sendResetPasswordRequest(pwkey:string, pwrt:string, newPassword:string, userLogin:string, exception:string){
    let requestUrl = this.resetPasswordUrl+"?";

    let params = new HttpParams();
    if(pwkey){
      params = params.append('pwkey',pwkey)
    }
    if(pwrt){
      params = params.append('pwrt',pwrt)
    }
    if(newPassword){
      params = params.append('newPassword',newPassword)
    }
    if(userLogin){
      params =  params.append('userLogin',userLogin)
    }
    if(exception){
      params =  params.append('exception',exception)
    }
    return this.apiConnector.getAsText(requestUrl+params.toString());

  }

   checkResetLinkValidity(pwkey:string, pwrt:string){
      let requestUrl = this.resetLinkValidityUrl+"?";

      let params = new HttpParams();
      if(pwkey){
        params = params.append('pwkey',pwkey)
      }
      if(pwrt){
        params = params.append('pwrt',pwrt)
      }
      return this.apiConnector.getAsText(requestUrl+params.toString());
    }

  get user$(): Observable<ProfileUser>{
    return this.user.asObservable();
  }

  addUser(data:ProfileUser) {
    this.user.next(data);
  }


  updateUser(user: userDto) {
    return this.apiConnector.patch<userDto>(this.url, user);
  }

  changePassword(password: PasswordDto) {
    return this.apiConnector.postAsText<PasswordDto>(this.passwordUrl, password)
  }

  changeParameters(parameter: ParameterDto) {
    return this.apiConnector.postAsText(this.parameterUrl, parameter);
  }

  saveNotification(notification: NotificationDto) {
    return this.apiConnector.postAsText(this.notificationUrl, notification)
  }

  getUserNotifications(): Observable<UserNotification> {
    return this.apiConnector.getAsText(this.notificationUrl);
  }
  getPasswordValidator(): Observable<any> {
    return this.apiConnector.get(this.passwordValidatorUrl);
  }
}

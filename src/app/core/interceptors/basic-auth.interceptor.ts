import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";
import {User} from "../model/user";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('currentUser');
    const currentUserTemps = idToken !== null ? JSON.parse(idToken) : new User();
    const currentUserSubject = new BehaviorSubject<User>(currentUserTemps);

    if (currentUserSubject.getValue().accessToken) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization",
          "Bearer " + currentUserSubject.getValue().accessToken)
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}

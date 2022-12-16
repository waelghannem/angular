import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import {AuthenticationService} from "../services/authentication.service";
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private authenticationService: AuthenticationService, private tokenStorage: TokenStorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this.tokenStorage.getToken();
    if (token != null) {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      console.log(error);
      if (error instanceof HttpErrorResponse && error.status === 403) {
        return this.handle401Error(authReq, next);
      }
      if(error.status === 400) {
        console.log(error.error)
        let errors = Object.values(JSON.parse(error.error));
        return throwError(errors.join("\r\n"))
      }
      return throwError(error);
    }));
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenStorage.getRefreshToken();

      let jwt = {
        Jwt: {
          refreshToken: token
        }
      }
      if (token)
        return this.authenticationService.tokenRefresh(jwt).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.tokenStorage.saveToken(token.Bearer);
            this.refreshTokenSubject.next(token.Bearer);

            return next.handle(this.addTokenHeader(request, token.Bearer));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.authenticationService.logout();
            // @ts-ignore
            location.reload(true);
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => {
        return token !== null
      }),
      take(1),
      switchMap((token) => {
        return next.handle(this.addTokenHeader(request, token))
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set("Authorization",
        "Bearer " + token)
    });
  }
}

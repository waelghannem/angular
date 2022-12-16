import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from "./services/authentication.service";
import { TokenStorageService } from './services/token-storage.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if(this.router.url.includes("login")){
      return true;
    }
    if (!this.tokenStorage.getRefreshToken() || !currentUser.accessToken || this.authenticationService.getExpiration().getTime() < Date.now()) {
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
    return true;
  }
}

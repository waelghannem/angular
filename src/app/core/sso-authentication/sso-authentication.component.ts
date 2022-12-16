import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../services/authentication.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import jwt_decode from "jwt-decode";
import { User } from '../model/user';
import { messageLife } from 'src/app/shared/constants';

@Component({
  selector: 'app-sso-authentication',
  templateUrl: './sso-authentication.component.html',
  styleUrls: ['./sso-authentication.component.css']
})
export class SsoAuthenticationComponent implements OnInit {
  refreshToken: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.route.queryParams.subscribe(params => {
      this.refreshToken = params['ssoKey'];
    })
   }

  ngOnInit(): void {
    if(this.refreshToken) {
      let jwt = {
        Jwt: {
          refreshToken: this.refreshToken
        }
      }
      this.authenticationService.tokenRefresh(jwt).subscribe((resp:any) => {
        this.tokenStorage.saveToken(resp.Bearer);
        this.tokenStorage.saveRefreshToken(this.refreshToken);
        let userObj:User = jwt_decode(resp.Bearer);
        let userObjet:any = {};
        userObjet.user = userObj;
        userObjet.accessToken = resp.Bearer;
        userObjet.refreshToken = this.refreshToken;
        localStorage.setItem('currentUser', JSON.stringify(userObjet));
        this.authenticationService.currentUserSubject.next(userObjet);
        this.router.navigate(["/"]);
      }, error => {
        this.messageService.add({severity: 'danger', summary: 'Error', detail: error.error, life: messageLife});
        this.router.navigate(["/login"]);
      })
    } else {
      this.router.navigate(["/login"]);
    }
  }

}

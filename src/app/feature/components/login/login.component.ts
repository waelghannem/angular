import {AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthenticationService} from "../../../core/services/authentication.service";
import {TokenStorageService} from 'src/app/core/services/token-storage.service';
import {MessageService} from "primeng/api";
import {faImage, faRefresh, faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {messageLife} from "../../../shared/constants";
import {UserService} from "../../services/user.service";
import {isPlatformBrowser} from "@angular/common";


@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('myInput') myInput: ElementRef;
  loginForm: FormGroup;
  captchaForm: FormGroup;
  loading = false;
  submitted = false;
  displayForgotPasswordDialog: boolean = false;
  displayRegisterDialog: boolean = false;
  returnUrl: string;
  error = '';
  np: boolean;
  resetLinkKey: string;
  resetLink: string;
  username: string;
  exception: string;
  failure: boolean;
  resetLinkStillActive: boolean

  resetPasswordLinkExpiredMessage: string;
  image: String;
  imageOrSoundCaptcha: boolean = false;
  faRefresh = faRefresh;
  faImage = faImage;
  faVolumeUp = faVolumeUp;
  saveDisabled = false;

  // TODO: get translation errors dynamically from AIO (AIO-14098)
  ssoErrors = new Map<string, string>([
    ["ssousrdenied", "Username does not belong to the right organization type."],
    ["ssoauth", "Cannot authenticate via SSO."],
    ["ssoruntime", "Error validating message."],
    ["ssosaml", "Error validating message."],
    ["ssovalidation", "Error validating message signature."],
    ["ssosec", "Error validating message signature."],
    ["ssodecrypt", "Error decrypting message."],
    ["ssoerror", "Cannot authenticate via SSO."]
]);
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.authenticationService.logout();

  }
  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.np = false
      if (params['np']) {
        this.np = Boolean(params['np'])
      }
      if (params['failure']) {
        this.failure = Boolean(params['failure'])
      }
      this.resetLinkKey = params['pwkey'];
      this.resetLink = params['pwrt'];
      this.username = params['username'];
      this.exception = params['exception'];
      if(this.failure == true && this.ssoErrors.get(this.exception) != null) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: this.ssoErrors.get(this.exception), life: messageLife});
      }
      if (this.np === true && this.resetLink && this.resetLinkKey) {
        this.userService.checkResetLinkValidity(this.resetLink, this.resetLinkKey).subscribe(value => {
          this.resetLinkStillActive = true
        }, error => {
          this.resetLinkStillActive = false
          this.resetPasswordLinkExpiredMessage = error.error
        })
      }
    });
  }

  ngOnInit() {

    this.authenticationService.refreshCaptcha("", false).subscribe({
      next: data => {
        if (data) {
          // @ts-ignore
          this.image = data.image;
          this.captchaForm.setValue({
            inputCaptcha: '',
          })
        }
      },
      error: err => {
        console.log(err)
      },
      complete: () => {
        console.log('refreshCaptcha completed.');
      }
    })
    document.body.className = "backgroundImage";
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.captchaForm = this.formBuilder.group({
      inputCaptcha: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.saveDisabled = true;
    this.loading = true;
    this.authenticationService.login(this.f['username'].value, this.f['password'].value).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveRefreshToken(data.refreshToken);
        this.tokenStorage.saveUser(data);
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: err => {
        if (err.status == 303) {
          this.image = err.error.image;
          this.captchaForm = this.formBuilder.group({
            inputCaptcha: ['', Validators.required]
          });
        } else if (this.error === "User credentials have expired") {
            this.navigateToResetPassword(this.f['username'].value, "credentialexpired");
        }
        else{
          this.error=err.error;
        }
        this.loading = false;
      },
      complete: () => {
        console.log('submit completed.')
      }
    });
  }

  get formCaptcha() {
    return this.captchaForm.controls;
  }

  onSubmitCatcha() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.captchaForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.validateCaptcha(this.formCaptcha['inputCaptcha'].value, this.imageOrSoundCaptcha)
      .pipe(first())
      .subscribe(
        data => {
          this.image = null;
          this.loading = false;
        },
        error => {
          if (error.status == 303) {
            this.image = error.error.image;


          } else {
            this.error = error.error;
          }
          this.captchaForm.setValue({
            inputCaptcha: '',
          })
          this.loading = false;
        });
  }

  navigateToResetPassword(username: string, exceptionCode: string) {
    this.messageService.add({severity: 'warn', summary: '', detail: this.error, life: messageLife});
    this.error = undefined
    this.resetLinkStillActive = true
    this.username = username
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        np: true,
        username: username,
        exception: exceptionCode
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }
  ssoLogin() {
    this.authenticationService.redirectSSO().subscribe((redirectUrl: any) => {
      window.location.replace(redirectUrl)
    })
  }
  ngOnDestroy(){
    document.body.className="";
  }

  onSendForgetPassword() {
    this.displayForgotPasswordDialog = false;
    this.messageService.add({
      severity: 'info',
      summary: '',
      detail: `If a similar request has not been already done recently, an email has been sent to the associated user.`,
      life: 3000
    });
  }

  onOpenRegister() {
    this.displayRegisterDialog = true;
  }

  refreshCaptcha() {
    this.authenticationService.refreshCaptcha("", this.imageOrSoundCaptcha)
      .pipe(first())
      .subscribe(
        data => {
          this.captchaForm.setValue({
            inputCaptcha: '',
          })
          this.image = null;
          // @ts-ignore
          this.image = data.image;

        },
        error => {
        });
  }
  setFocus(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      this[id].nativeElement.focus();
    }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Password } from 'src/app/feature/models/password';
import { UserService } from 'src/app/feature/services/user.service';
import { AppService } from 'src/app/shared/breadcrumb/app.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import {Router} from '@angular/router';
import {MessageService} from "primeng/api";
import { ProfileUser } from 'src/app/feature/models/profileUser';
import {messageLife} from "../../../shared/constants";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @Input()
  resetLinkKey: string

  @Input()
  resetLink: string

  @Input()
  username: string

  @Input()
  exception: string

  user: ProfileUser;
  public passwordForm: FormGroup;
  submitted: boolean = false;
  passwordMessage: string = ""
  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private fb: FormBuilder,
              private appService: AppService,
              private userService: UserService,
              private messageService: MessageService) { }

  customValidators = CustomValidators;

  ngOnInit(): void {
    this.userService.getPasswordValidator().subscribe((value:any) => {
      this.passwordMessage = value.passwordMessage;
      this.passwordForm = this.fb.group({
          newPassword: new FormControl('', Validators.compose([
            // 1. Password Field is Required
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32),
            CustomValidators.patternValidator(new RegExp(value.pattern), { passwordError: true })
          ])),
          confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(64)])
        },
        {
          validator: CustomValidators.mustMatch('newPassword', 'confirmPassword')
        });
    })


  }
  public onSubmit() {
    this.submitted= true;
    if(!this.passwordForm.valid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    let password = new Password();
    password.newPassword = this.passwordForm.get("newPassword")?.value;
    this.userService.sendResetPasswordRequest(this.resetLinkKey, this.resetLink, password.newPassword, this.username, this.exception).subscribe(value => {
      console.log(value)
      this.router.navigate(['/login']).then(() => {
       // window.location.reload();
        this.messageService.add({severity: 'info', summary: '', detail: "Password has been changed", life: messageLife});
      });
    }, error => {
      this.messageService.add({severity: 'error', summary: '', detail: error.error, life: messageLife});
    })
  }
}

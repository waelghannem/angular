import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Password } from 'src/app/feature/models/password';
import { UserService } from 'src/app/feature/services/user.service';
import { AppService } from 'src/app/shared/breadcrumb/app.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { ToastType } from 'src/app/shared/models/toastType';
import {Router} from '@angular/router';
import {MessageService} from "primeng/api";
import { ProfileUser } from 'src/app/feature/models/profileUser';
import {messageLife} from "../../../../shared/constants";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  user: ProfileUser;
  public passwordForm: FormGroup;
  submitted: boolean = false;
  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private fb: FormBuilder,
              private appService: AppService,
              private userService: UserService,
              private messageService: MessageService) { }

  displayModal: boolean;
  customValidators = CustomValidators;

  showModalDialog() {
    this.displayModal = true;
}
  ngOnInit(): void {
    this.appService.updateBreadCrumb(["profile", "My password"]);
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.passwordForm = this.fb.group({
        oldPassword: new FormControl('', [Validators.required, Validators.maxLength(64)]),
        newPassword: new FormControl('', Validators.compose([
          // 1. Password Field is Required
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          CustomValidators.patternValidator(new RegExp(this.user.passwordPattern), { passwordError: true })
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
    password.oldPassword = this.passwordForm.get("oldPassword")?.value;
    this.userService.changePassword({
      Password: password
    }).subscribe(response => {
      this.showModalDialog();
    }, err => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Old password is incorrect', life: messageLife});
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getControl(field: string) {
    return this.passwordForm.get(field);
}


}

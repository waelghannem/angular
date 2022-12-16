import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProfileUser} from 'src/app/feature/models/profileUser';
import {UserService} from 'src/app/feature/services/user.service';
import {AppService} from 'src/app/shared/breadcrumb/app.service';
import {CustomValidators} from 'src/app/shared/custom-validators';
import {ToastType} from 'src/app/shared/models/toastType';
import {MessageService} from "primeng/api";
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import {messageLife} from "../../../../shared/constants";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  public myAccountForm: FormGroup;
  submitted: boolean = false;
  isValidField = CustomValidators.isValidField
  isInvalidField = CustomValidators.isInvalidField

  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder, private appService: AppService, private userService: UserService, private messageService: MessageService) {
  }

  user: ProfileUser;

  ngOnInit(): void {
    this.appService.updateBreadCrumb(["profile", "My account"]);
    this.myAccountForm = this.fb.group({
      id: new FormControl(''),
      email: new FormControl('', Validators.email),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phone: new FormControl(''),
      mobile: new FormControl('')
    });
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.setFormValue(this.user);
    });
  }

  setFormValue(user: ProfileUser) {
    this.myAccountForm.setValue({
      id: user.login ? user.login : '',
      email: user.email ? user.email : '',
      firstName: user.firstname ? user.firstname : '',
      lastName: user.lastname ? user.lastname : '',
      phone: user.phone ? user.phone : '',
      mobile: user.mobile ? user.mobile : ''
    })
  }

  public onSubmit() {
    this.submitted = true;
    if (!this.myAccountForm.valid) {
      this.myAccountForm.markAllAsTouched();
      return;
    }
    let userDto = this.loadUserFromForm();
    this.userService.updateUser({User: userDto})
      .subscribe(response => {
        this.messageService.add({severity: 'success', summary: 'Successful', detail: `User ${this.authenticationService.currentUserValue.user.sub} saved`, life: messageLife});
      }, err => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Accounts not updated', life: messageLife});
      });
  }

  loadUserFromForm() {
    let userDto: ProfileUser = new ProfileUser();
    userDto.email = this.myAccountForm.get("email")?.value;
    userDto.firstname = this.myAccountForm.get("firstName")?.value;
    userDto.lastname = this.myAccountForm.get("lastName")?.value;
    userDto.phone = this.myAccountForm.get("phone")?.value;
    userDto.mobile = this.myAccountForm.get("mobile")?.value;
    return userDto;
  }

  getControl(field: string) {
    return this.myAccountForm.get(field);
  }

}


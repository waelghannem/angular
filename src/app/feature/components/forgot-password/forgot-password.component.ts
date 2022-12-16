import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {MessageService} from "primeng/api";
import {messageLife} from "../../../shared/constants";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Input()
  displayDialog: boolean;
  submitted = false;
  loading = false;
  @Output()
  sendForgetPasswordEvent = new EventEmitter<any>();
  forgetPasswordFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.forgetPasswordFormGroup = this.fb.group({
      userId: new FormControl('', Validators.required)
    });
  }

  sendForgotPasswordRequest() {
    this.submitted = true;
    this.loading = true;

    if (this.forgetPasswordFormGroup.invalid) {
      this.forgetPasswordFormGroup.markAllAsTouched();
      return;
    }

    this.userService.sendForgotPasswordRequest(this.forgetPasswordFormGroup.get("userId").value).subscribe((value:any) => {
      this.messageService.add({severity: 'info', summary: '', detail: value, life: messageLife});
      this.sendForgetPasswordEvent.emit("");
      this.loading = false;
    },error => {
      this.messageService.add({severity: 'danger', summary: 'Error', detail: error, life: messageLife});
      this.loading = false;
    })
  }

  hideDialog() {
    this.sendForgetPasswordEvent.emit("");
  }
}

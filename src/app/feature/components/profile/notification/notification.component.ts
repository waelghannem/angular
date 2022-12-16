import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserNotification} from 'src/app/feature/models/userNotification';
import {UserService} from 'src/app/feature/services/user.service';
import {AppService} from 'src/app/shared/breadcrumb/app.service';
import {ToastType} from 'src/app/shared/models/toastType';
import {MessageService} from "primeng/api";
import {messageLife} from "../../../../shared/constants";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  checked = false;
  userNotification: UserNotification;
  public notificationForm: FormGroup;

  constructor(private fb: FormBuilder,
              private appService: AppService,
              private userService: UserService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.appService.updateBreadCrumb(["profile", "My general notifications"]);
    this.notificationForm = this.fb.group({
      notification: new FormControl(),
      workflowNotification: new FormControl(),
      workflowUserNotNotifiableIfAbsent: new FormControl()
    });
    this.userService.getUserNotifications().subscribe((userNotification: UserNotification) => {
      this.notificationForm.setValue({
        notification: userNotification.notified,
        workflowNotification: userNotification.workflowNotification,
        workflowUserNotNotifiableIfAbsent: userNotification.workflowUserNotNotifiableIfAbsent
      })
    })
  }

  public onSubmit() {
    let notification = this.notificationForm.get("notification")?.value != null ? this.notificationForm.get("notification")?.value : false;
    let workflowNotification = this.notificationForm.get("workflowNotification")?.value != null ? this.notificationForm.get("workflowNotification")?.value : false;
    let workflowUserNotNotifiableIfAbsent = this.notificationForm.get("workflowUserNotNotifiableIfAbsent")?.value != null ? this.notificationForm.get("workflowUserNotNotifiableIfAbsent")?.value : false;

    let userNotification = new UserNotification();
    userNotification.notified = notification;
    userNotification.workflowNotification = workflowNotification;
    userNotification.workflowUserNotNotifiableIfAbsent = workflowUserNotNotifiableIfAbsent;

    this.userService.saveNotification({Notification: userNotification}).subscribe(response => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Notification updated',
        life: messageLife
      });
    }, err => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Notification could not be updated',
        life: messageLife
      });
    });

  }


}

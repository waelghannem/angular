import { Component, ElementRef, Input, OnInit, Type, ViewChild } from '@angular/core';
import { AppService } from '../breadcrumb/app.service';
import { ToastType } from '../models/toastType';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent implements OnInit {
  ToastType = ToastType;
  @Input() type: ToastType;
  @Input() message: string;
  constructor(private appService: AppService) { }

  ngOnInit(): void {

    this.appService.toast.subscribe()
  }

}

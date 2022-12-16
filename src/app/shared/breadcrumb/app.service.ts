import { Injectable, EventEmitter } from '@angular/core';
import { ToastType } from '../models/toastType';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  breadCrumb = new EventEmitter<string[]>();
  toast = new EventEmitter<{type: ToastType, message: string}>();
  constructor() { }

  updateBreadCrumb(titles: string[]) {
    this.breadCrumb.emit(titles);
  }

  showToast(type: ToastType, message: string) {
    this.toast.emit({type, message});
  }
}

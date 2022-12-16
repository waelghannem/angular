import {OnInit, Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe extends DatePipe implements PipeTransform, OnInit {
  formatPattern?: string = "dd_mm_yyyy";

  override transform(value: any, args?: any): any {
    if (args)
      return super.transform(value, args);
    return super.transform(value, this.formatPattern);
  }

  ngOnInit(): void {
  }
}

import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { AppService } from './app.service';
import {MenuItem} from 'primeng/api';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  titlesList: string[] = [];
  items: MenuItem[];

  home: MenuItem;
  constructor(private appService: AppService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.home = {icon: 'fa fa-home'}
    this.items = [];
    this.appService.breadCrumb.subscribe(titles => {
      this.items = [];
      this.titlesList.splice(0,this.titlesList.length)
      titles.forEach(title => this.items.push({label: title}))
      this.cdr.detectChanges();
    })
  }

}

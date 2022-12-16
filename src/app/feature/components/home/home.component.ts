import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/shared/breadcrumb/app.service';
import { first } from 'rxjs/operators';
import {UserService} from "../../../core/services/user.service";
import {User} from "../../../core/model/user";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = false;
  constructor(private appService: AppService,private userService: UserService) { }

  ngOnInit(): void {
    this.loading = true;
    this.loading = false;
    /*TODO solve the pb of updateBreadCrumb using the routes*/
    this.appService.updateBreadCrumb(["home"]);
  }

}

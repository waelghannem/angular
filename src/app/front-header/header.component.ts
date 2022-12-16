import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {User} from '../core/model/user';
import {AuthenticationService} from "../core/services/authentication.service";
import {MenuItem, PrimeNGConfig} from "primeng/api";
import {ProfileUser} from "../feature/models/profileUser";
import {UserService} from "../feature/services/user.service";
import {ThemeService} from "../feature/services/themeService";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  itemsHeader: MenuItem[];
  itemsProfile: MenuItem[];
  @Input() isLoggedIn: () => boolean;

  @Input() logout: () => void;

  user: any;
  profileUser: ProfileUser;

  constructor(private userService: UserService, private router: Router,
              private authenticationService: AuthenticationService,
              private themeService: ThemeService) {
  }

  ngOnInit(): void {
    const idToken = localStorage.getItem('currentUser');
    const currentUserTemps = idToken !== null ? JSON.parse(idToken) : new User();
    this.user = currentUserTemps.user;

    this.userService.getUser().subscribe(user => {
        this.profileUser = user;
        if(this.profileUser.selectedTheme){
          this.themeService.switchTheme(this.profileUser.selectedTheme)
        }
        this.profileUser.datePattern ?  this.profileUser.datePattern.replaceAll("_", '/') : this.profileUser.datePattern;
        this.itemsHeader = [
          {
            label: 'Home',
            icon: 'fa fa-home',
            routerLink: 'home', routerLinkActiveOptions: 'active'
          },
          {
            label: 'Order',
            icon: 'fa fa-pencil',
            items: [
              {
                label: 'List Orders',
                icon: 'fa fa-book',
                routerLink: 'orders', routerLinkActiveOptions: 'active'
              },

            ]
          },
          {
            label: 'Payment',
            icon: 'fa fa-user',
            items: [
              {
                label: 'New',
                icon: 'fa fa-user-plus',

              },
              {
                label: 'Delete',
                icon: 'fa fa-user-minus',

              },
              {
                label: 'Search',
                icon: 'fa fa-users',
                items: [
                  {
                    label: 'Filter',
                    icon: 'fa fa-filter',
                    items: [
                      {
                        label: 'Print',
                        icon: 'fa fa-print'
                      }
                    ]
                  },
                  {
                    icon: 'fa fa-bars',
                    label: 'List'
                  }
                ]
              }
            ]
          },
          {
            label: 'Adresses',
            icon: 'fa fa-calendar',
            items: [
              {
                label: 'Edit',
                icon: 'fa fa-pencil',
                items: [
                  {
                    label: 'Save',
                    icon: 'fa fa-calendar-plus'
                  },
                  {
                    label: 'Delete',
                    icon: 'fa fa-calendar-minus'
                  },

                ]
              },
              {
                label: 'Carrier',
                icon: 'fa fa-calendar-times',
                items: [
                  {
                    label: 'Remove',
                    icon: 'fa fa-calendar-minus'
                  }
                ]
              }
            ]
          },
          {
            label: 'Product',
            icon: 'fa fa-box'
          }
        ];


        this.itemsProfile = [{
          label: 'Profile',
          items: [{
            label: this.profileUser.fullname,
            icon: 'fa fa-id-card',
            routerLink: 'profile/myAccount'
          },
            {
              label: this.profileUser.primaryGroup.fullname,
              icon: 'fa fa-home',
              command: () => {
                //this.delete();
              }
            }
          ]
        },
          {
            label: 'Navigate',
            items: [{
              label: this.profileUser.isParnter?'My users':'My partners',
              icon: 'fa fa-users'
            },
              {
                label: 'Communication',
                icon: 'fa fa-bullhorn'
              },
              {
                label: 'Activity',
                icon: 'fa fa-share'
              },
              {
                label: 'Deployment',
                icon: 'fa fa-wifi'
              }
            ]
          },
          {
            label: 'Session',
            items: [{
              label: 'Switch user',
              icon: 'fa fa-retweet'
            },
              {
                label: 'Sign Out',
                icon: 'fa fa-lock',
                command: () => {
                  this.logout();
                }
              },

            ]
          }
        ];
      }
    );
  }


}

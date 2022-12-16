import { Component, OnInit } from '@angular/core';
import { ProfileUser } from '../../models/profileUser';
import { UserService } from '../../services/user.service';
import { MenuItem, PrimeNGConfig } from "primeng/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: ProfileUser = new ProfileUser();
  items: MenuItem[];
  initial: string = "";

  constructor(private userService: UserService, private primengConfig: PrimeNGConfig) {
  }


  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.items = [{
        label: 'My Account',
        icon: 'fa fa-id-card',
        routerLink: '/profile/myAccount'
      },
      {
        label: user.isParnter ? 'My partner information' : 'My company information',
        icon: 'fa fa-home',
        routerLink: '/profile/myCompanyInformation'
      },
      {
        label: 'My password',
        icon: 'fa fa-lock',
        routerLink: '/profile/myPassword'
      },
      {
        label: 'My settings',
        icon: 'fa fa-wrench',
        routerLink: '/profile/mySettings'
      },
      {
        label: 'My notifications',
        icon: 'fa fa-envelope',
        routerLink: '/profile/myNotification'
      },
      {
        label: user.isParnter ? 'Bank details of my company' : 'Bank details of my partners',
        icon: 'fa fa-building',
        routerLink: '/profile/bankDetailsPartnerv2'
      }
      ];
      if (user.isParnter) {
        this.items = [...this.items,
          {
            label: 'Addresses of my company',
            icon: 'fa fa-globe',
            routerLink: '/profile/companyAddresses'
          }
        ]
      }
      this.user = user;
      this.initial = this.getInitials(user.fullname);

    });


    this.primengConfig.ripple = true;

 

  }

  getInitials(name: string): string {
    if (name != undefined) {
      const fullName = name.split(' ');
      const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
      return initials.toUpperCase();
    }
    return name;
  }
}

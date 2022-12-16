import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AppService } from 'src/app/shared/breadcrumb/app.service';

interface Order {
  id: string,
  from: string,
  to: string,
  reference: string,
  issueDate: Date,
  orderRequestedDeliverByDate: Date,
  sellerPartyID: string,
  sellerPartyName: string,
  shipFromPartyName: string,
  status: {statusCode : string}
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  allOrders: Order[] = [];
  orderIdentifier: string = "";
  allUsers: any = [];
  isChecked = false;

  constructor(private service: OrderService, private appService: AppService) {
  }

  checkuncheckall() {
    this.isChecked = !this.isChecked;
  }

  ngOnInit(): void {
    this.appService.updateBreadCrumb(["home","orders"]);
  }

  orders(id: string): void {
    this.service.orders(id).subscribe((response: any) => {
      this.allOrders = response.content;
    })

  }

  public onSubmit() {
    this.orders(this.orderIdentifier);
  }

  ngOnDestroy(): void {
  }
}

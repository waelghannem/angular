import {Injectable} from '@angular/core';
import {ApiConnectorService} from 'src/app/core/services/api-connector.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  postsURL = "/GIS/edocument/order/search/?bql=buyerOrderNumber=";

  constructor(private apiConnector: ApiConnectorService) {
  }

  orders(id: string) {
    return this.apiConnector.get(this.postsURL + id);
  }

}

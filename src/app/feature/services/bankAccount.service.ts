import {Injectable} from '@angular/core';
import {ApiConnectorService} from 'src/app/core/services/api-connector.service';
import {Observable, Subject, tap} from 'rxjs';
import {BankAccount} from "../models/bankAccount";
import {userDto} from "./user.service";


interface BankAccountDto {
  BankAccount: BankAccount
}

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  private _refreshRequired = new Subject<void>();
  url = "/bank-accounts";

  constructor(private apiConnector: ApiConnectorService) {
  }

  get RefreshRequired() {
    return this._refreshRequired;
  }

  private bankAccount: Subject<BankAccount> = new Subject<BankAccount>();

  getBankAccount(): Observable<BankAccount[]> {
    return this.apiConnector.get<BankAccount[]>(this.url );
  }

  get bankAccount$(): Observable<BankAccount> {
    return this.bankAccount.asObservable();
  }

  addAccount(data: BankAccountDto) {
    return this.apiConnector.postAsText<BankAccountDto>(this.url , data).pipe(
      tap(() => {
        this._refreshRequired.next();
      })
    )
  }

  getCurrencies(): Observable<any[]> {
    return this.apiConnector.get<any[]>("/currencies");
  }

  deleteAccount(id: String) {
    return this.apiConnector.delete(this.url , id).pipe(
      tap(() => {
        this._refreshRequired.next();
      })
    )
  }
}

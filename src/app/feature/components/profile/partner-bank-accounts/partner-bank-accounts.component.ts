import {Component, OnInit} from '@angular/core';
import {BankAccount} from "../../../models/bankAccount";
import {BankAccountService} from "../../../services/bankAccount.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {UserService} from "../../../services/user.service";
import {ProfileUser} from "../../../models/profileUser";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IbanFormatterPipe, ValidatorService} from "angular-iban";
import {CustomValidators} from "../../../../shared/custom-validators";
import {AppService} from "../../../../shared/breadcrumb/app.service";
import {messageLife} from "../../../../shared/constants";


interface Currencies {
  disabled: boolean;
  label: 'string';
  value: string;
  escape: boolean;
  noSelectionOption: boolean
}

@Component({
  selector: 'app-partner-bank-accounts',
  templateUrl: './partner-bank-accounts.component.html',
  styleUrls: ['./partner-bank-accounts.component.css'],
  providers: [IbanFormatterPipe]
})


export class PartnerBankAccountsComponent implements OnInit {
  customValidators = CustomValidators
  accountDialog: boolean;
  removeAccountDialog: boolean;
  bankAccounts: BankAccount[];

  bankAccount: BankAccount = new BankAccount();

  selectedBankAccounts: BankAccount[];

  submitted: boolean;
  itemsHeader: MenuItem[];
  itemsDetails: MenuItem[];
  public currencies: Currencies[];
  selectedCurrency: string = "EUR";
  user: ProfileUser = new ProfileUser();

  title: string = "";

  constructor(private accountService: BankAccountService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private userService: UserService, private fb: FormBuilder, private ibanFormatterPipe: IbanFormatterPipe, private appService: AppService) {
  }

  public ibanReactive: FormControl;
  bankForm: FormGroup;

  ngOnInit() {
    this.ibanReactive = new FormControl(
      null,
      [
        Validators.required,
        ValidatorService.validateIban
      ]
      );
      this.initAddAccountForm();
      
      this.userService.getUser().subscribe(user => {
      this.title = user.isParnter ? "Bank details of my company" : "Bank details of my partners";
      this.appService.updateBreadCrumb(["profile", this.title]);
      this.user = user;
      // @ts-ignore
      this.user.datePattern = this.user.datePattern.replaceAll("_", '/');

      this.itemsHeader = [{
        label: 'Add', icon: 'fa fa-plus', command: () => {
          this.openNew()
        },
        visible: this.user.isParnter
      }]
      this.itemsDetails = [{
        label: 'Delete', icon: 'fa fa-trash',

        command: (event: any) => {
          this.removeAccountDialog = true;
        },
        visible: this.user.isParnter
      }];
    });
    this.accountService.RefreshRequired.subscribe(response => {
      this.getAllBankAccounts();
    })
    this.getAllBankAccounts();
    this.accountService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
    })
  }

  private initAddAccountForm() {
    this.bankForm = new FormGroup({
      /*ibanReactive: this.ibanReactive,*/
      'ibanReactive': new FormControl("", [Validators.required, Validators.required, ValidatorService.validateIban]),
      'bic': new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(11)]),
      'currency': new FormControl("", [Validators.required,])
    });
  }

  private getAllBankAccounts() {
    this.accountService.getBankAccount().subscribe(bankAccounts => {
      this.bankAccounts = bankAccounts;
    });
  }

  openNew() {
    this.bankAccount = new BankAccount();
    this.initAddAccountForm();
    //put the default value
    this.bankAccount.currency = this.selectedCurrency;
    this.submitted = false;
    this.accountDialog = true;

  }

  openDeleteDialog() {
    this.initAddAccountForm();
    this.submitted = false;
    this.removeAccountDialog = true;

  }

  deleteAccount() {
    this.accountService.deleteAccount(this.bankAccount.iban).subscribe(response => {
      this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Account Deleted', life: messageLife});
      this.removeAccountDialog = false;

    }, err => {
      this.messageService.add({
        severity: 'warn',
        summary: 'Not deleted',
        detail: 'Account Could not be deleted',
        life: messageLife
      });
    });
  }

  hideDialog() {
    this.accountDialog = false;
    this.removeAccountDialog = false;
    this.submitted = false;
  }

  saveAccount() {
    this.submitted = true;
    if (!this.bankForm.valid) {
      this.bankForm.markAllAsTouched();
      return;
    }
    this.bankAccount.bic = this.bankForm.get("bic")?.value
    this.bankAccount.iban = this.bankForm.get("ibanReactive")?.value
    this.bankAccount.currency = this.bankForm.get("currency")?.value;
    this.accountService.addAccount({BankAccount: this.bankAccount}).subscribe(response => {
      this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Account Created', life: messageLife});
      this.bankAccounts.push(this.bankAccount);
      this.bankAccounts = [...this.bankAccounts];
      this.accountDialog = false;
      this.bankAccount = new BankAccount();
    }, err => {
      if (err.status == 302) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Currency already exist', life: messageLife});
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Account could not be saved',
          life: messageLife
        });
      }
    });


  }

  findIndexById(iban: string): number {
    let index = -1;
    for (let i = 0; i < this.bankAccounts.length; i++) {
      if (this.bankAccounts[i].iban === iban) {
        index = i;
        break;
      }
    }

    return index;
  }

  showValue(value: any) {
    console.log(value);
  }

  public onClickMenu(rowData: any) {
    this.bankAccount = rowData;
  }

  hideTheMiddleOfTheIban(ibanToHide: any): String {
    return ibanToHide.substring(0, 2) + "xxxxx" + ibanToHide.substring(ibanToHide.length - 5, ibanToHide.length);
  }

  formatIban() {
    this.bankAccount.iban = this.ibanFormatterPipe.transform(this.bankAccount.iban);
  }
}

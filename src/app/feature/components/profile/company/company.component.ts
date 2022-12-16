import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Company} from 'src/app/feature/models/company';
import {CompanyService} from 'src/app/feature/services/company.service';
import {AppService} from 'src/app/shared/breadcrumb/app.service';
import {CustomValidators} from 'src/app/shared/custom-validators';
import {MessageService} from "primeng/api";
import {AuthenticationService} from "../../../../core/services/authentication.service";
import {UserService} from "../../../services/user.service";
import {ProfileUser} from "../../../models/profileUser";
import {messageLife} from "../../../../shared/constants";


interface Country {
  disabled: boolean,
  label: string,
  value: string,
  noSelectionOption: boolean
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  public myCompanyInformationForm: FormGroup;
  submitted: boolean = false;
  company: Company;
  countries?: Country[] = [];
  customValidators = CustomValidators
  profileUser: ProfileUser=new ProfileUser();

  constructor(private fb: FormBuilder,
              private appService: AppService,
              private companyService: CompanyService,
              private messageService: MessageService,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.profileUser = user;
      this.profileUser.datePattern = this.profileUser.datePattern.replaceAll("_", '/');

    });
    this.companyService.getCompany().subscribe(company => {
      this.company = company;
      this.companyService.getCountries().subscribe(c => {
        this.countries = c;
        this.setFormValue(this.company);
      })

    }, error => {
      console.log(error);
    });
    this.appService.updateBreadCrumb(["profile", "My company information"]);
    this.myCompanyInformationForm = this.fb.group({
      code: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email]),
      customer: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      addressComplement: new FormControl(''),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      vatCode: new FormControl(''),
      reference: new FormControl(''),
      registerName: new FormControl(''),
      governmentReference: new FormControl(''),
      legalCapital: new FormControl(''),
      legalStructure: new FormControl('')
    });
  }

  setFormValue(company: Company) {
    let country = this.countries.filter(c => {
      if (company.location.address.country.indexOf("_") !== -1) {
        return c.value === company.location.address.country.substring(1).toUpperCase()
      }
      return c.value === company.location.address.country.toUpperCase()
    });
    this.myCompanyInformationForm.setValue({
      code: company.code ? company.code : '',
      email: company.orderEmail ? company.orderEmail : '',
      customer: company.fullname ? company.fullname : '',
      address: company.location.address.streetName ? company.location.address.streetName : '',
      addressComplement: company.location.address.addressComplement ? company.location.address.addressComplement : '',
      postalCode: company.location.address.postalCode ? company.location.address.postalCode : '',
      city: company.location.address.city ? company.location.address.city : '',
      country: country.length > 0 ? country[0].value : '',
      vatCode: company.vat ? company.vat : '',
      reference: company.duns ? company.duns : '',
      registerName: company.registeredName ? company.registeredName : '',
      governmentReference: company.registration ? company.registration : '',
      legalCapital: company.shareCapital ? company.shareCapital : '',
      legalStructure: company.legalStructure ? company.legalStructure : ''
    })
    if (!company.companyUser) {
      this.myCompanyInformationForm.addControl(
        'code', new FormControl('', Validators.compose([CustomValidators.maxLength(255), Validators.required])))

      this.myCompanyInformationForm.controls['code'].setValue(company.code)
    }
  }

  public onSubmit() {
    this.submitted = true;
    if (!this.myCompanyInformationForm.valid) {
      this.myCompanyInformationForm.markAllAsTouched();
      return;
    }
    this.loadCompanyFromFrom();
    this.company.extension = this.company.extension !== "null" ? this.company.extension : null;
    this.companyService.updateCompany({Company: this.company}).subscribe(response => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `User ${this.authenticationService.currentUserValue.user.sub} saved`,
        life: messageLife
      });
    }, err => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Company details not updated', life: messageLife});
    });
  }

  loadCompanyFromFrom() {
    this.company.orderEmail = this.myCompanyInformationForm.get("email")?.value;
    this.company.fullname = this.myCompanyInformationForm.get("customer")?.value;
    this.company.location.address.streetName = this.myCompanyInformationForm.get("address")?.value;
    this.company.location.address.addressComplement = this.myCompanyInformationForm.get("addressComplement")?.value;
    this.company.location.address.postalCode = this.myCompanyInformationForm.get("postalCode")?.value;
    this.company.location.address.city = this.myCompanyInformationForm.get("city")?.value;
    this.company.location.address.county = this.myCompanyInformationForm.get("country")?.value;
    this.company.vat = this.myCompanyInformationForm.get("vatCode")?.value;
    this.company.duns = this.myCompanyInformationForm.get("reference")?.value;
    this.company.registeredName = this.myCompanyInformationForm.get("registerName")?.value;
    this.company.registration = this.myCompanyInformationForm.get("governmentReference")?.value;
    this.company.shareCapital = this.myCompanyInformationForm.get("legalCapital")?.value;
    this.company.legalStructure = this.myCompanyInformationForm.get("legalStructure")?.value;
    this.company.country = this.myCompanyInformationForm.get("country")?.value;
  }


}

import { Injectable } from '@angular/core';
import { ApiConnectorService } from 'src/app/core/services/api-connector.service';
import { Company } from '../models/company';
import { Observable, Subject } from 'rxjs';
import { locale } from 'moment';


interface CompanyDto {
  Company: Company
}
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiConnector: ApiConnectorService) { }

  url = "/company";
  countriesUrl = "/countries";

  private company:Subject<Company> = new Subject<Company>();

  getCompany(): Observable<Company> {
    return this.apiConnector.get<Company>(this.url);
  }


  get company$(): Observable<Company>{
    return this.company.asObservable();
  }

  addCompany(data:Company) {
    this.company.next(data);
  }

  updateCompany(company: CompanyDto) {
    delete company.Company.location.address.country;
    return this.apiConnector.patch<CompanyDto>(this.url, company);
  }

  getCountries() {
    return this.apiConnector.get<any>(this.countriesUrl);
  }

}

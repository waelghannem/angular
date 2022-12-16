import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {EnvConfigurationService} from 'src/app/env-configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectorService {
  api!: String;
  httpOptions!: {};

  constructor(private http: HttpClient, private envConfigurationService: EnvConfigurationService) {
    this.api = `${environment.apiUrl}`
    this.envConfigurationService.load().subscribe(conf => {
      this.api = conf.apiUrl ? conf.apiUrl : this.api;
    })
  }

  get<T>(url: string) {
    return this.http.get<T>(this.api + url, this.httpOptions);
  }

  getWithBody<T>(url: string, body: String) {
    let bodyConverted = JSON.stringify(body);
    let httpOptionsBody = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'body': bodyConverted
      })
    };
    return this.http.get<T>(this.api + url, httpOptionsBody)
  }

  patch<T>(url: string, body: T) {
    return this.http.patch<T>(this.api + url, body, this.httpOptions)
  }

  post<T>(url: string, body: T, responseType?: { responseType: 'json' }) {
    return this.http.post<T>(this.api + url, body, responseType)
  }

  postAsText<T>(url: string, body: T, responseType?: { responseType: 'text' }) {
    return this.http.post(this.api + url, body, {responseType: 'text'})
  }

  delete<T>(url: string, id:String, responseType?: { responseType: 'text' }) {

    const urlFinal = `${this.api + url}/${id}`;
    return this.http.delete(urlFinal,{responseType: 'text'})
  }

  getAsText(url: string, responseType?: { responseType: 'text' }): Observable<any>  {
    return this.http.get(this.api + url, {responseType: 'text'})
  }

}

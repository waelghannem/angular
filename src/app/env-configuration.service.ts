import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";


interface Configuration {
  apiUrl: string;
  apiUserName: string;
  apiPassword: string;
  stage: string;
}

@Injectable({ providedIn: 'root' })
export class EnvConfigurationService {
  private readonly apiUrl = './assets/config/environment.json';

  private configuration$!: Observable<Configuration>;

  constructor(private http: HttpClient) {}

  public load(): Observable<Configuration> {
    if (!this.configuration$) {
      this.configuration$ = this.http
        .get<Configuration>(`${this.apiUrl}`)
        .pipe(shareReplay(1));
    }
    return this.configuration$;
  }
}

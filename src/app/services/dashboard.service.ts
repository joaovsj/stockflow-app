import { Injectable } from '@angular/core';
import { ServiceService } from './service.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ServiceService{

  constructor(
    http: HttpClient,
    cookie: CookieService
    ){
      super(http, cookie)
      this.endPoint = 'dashboard';
    }

    getDataBar(values: any | null): Observable<any>{
      return this.http.post(`${this.apiUrl}/${this.endPoint}/`, values, this.requestOptions);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends ServiceService{

  constructor(
    http: HttpClient,
    cookie: CookieService
    ){
    super(http, cookie)
    this.endPoint = 'users';
  }
}

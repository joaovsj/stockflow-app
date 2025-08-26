import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

// Services
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ServiceService{

  constructor(
    http: HttpClient,
    cookie: CookieService
  ) { 
    super(http, cookie)
    this.endPoint = 'category'
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceService } from './service.service';
import { CookieService} from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ServiceService{

  constructor(
    http: HttpClient,
    cookie: CookieService
  ) { 
    super(http, cookie)
    this.endPoint = 'products'
  }

  public searchItem(name: string, category: string){

    const fieldName     = name     == "null" ? "" : name;
    const fieldCategory = category == "null" ? "" : category;  

    return this.http.get(`${this.apiUrl}/${this.endPoint}/?name=${fieldName}&category=${fieldCategory}`, this.requestOptions);
  }

}

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  apiUrl: string = environment.url;
  endPoint: string;
  headers: HttpHeaders;
  requestOptions: any;
  token: string;
  
  public registerDone$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    protected http: HttpClient,
    private cookie: CookieService
  ){
    this.token = cookie.get('token');
    this.headers = new HttpHeaders({"Authorization": "Bearer "+this.token});
    this.requestOptions = {headers: this.headers}
  }

  public done(){
    this.registerDone$.next(true);
  }

  getItems(): Observable<any>{
    return this.http.get(`${this.apiUrl}/${this.endPoint}`, this.requestOptions);
  }

  getItem(id: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/${this.endPoint}/${id}`, this.requestOptions);
  }

  searchItems(params: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/${this.endPoint}/search`, params, this.requestOptions);
  }
  
  postItem(body: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/${this.endPoint}`, body, this.requestOptions);
  }
  
  updateItem(id: string, body: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${this.endPoint}/${id}`, body, this.requestOptions);
  }
  
  deleteItem(id: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${this.endPoint}/${id}`, this.requestOptions);
  }
  
  deleteAll(body: any){
    return this.http.post(`${this.apiUrl}/${this.endPoint}/all`, body, this.requestOptions);
  }
}

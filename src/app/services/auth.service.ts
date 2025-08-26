import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notyf } from 'notyf';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = environment.url
  private notyf : Notyf;
  
  constructor(
    private http: HttpClient
  ){ 
    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }

  public login(params: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, params).pipe(
      catchError((err: HttpErrorResponse)=>{return this.handleError(err)})
    )
  }

  private handleError(error: HttpErrorResponse){
    if(error.message){
      this.notyf.error({message: error.message});
      return throwError(()=> error.error)
    }
  }
}

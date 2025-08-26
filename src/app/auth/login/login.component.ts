import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { CookieService }    from 'ngx-cookie-service';
import { Observable }       from 'rxjs';
import { CommonModule } from '@angular/common';
import { Notyf } from 'notyf';  

// MDBootstrap
import { MdbFormsModule }       from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule }      from 'mdb-angular-ui-kit/ripple';
import { MdbValidationModule }  from 'mdb-angular-ui-kit/validation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule, MdbRippleModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  http$: Observable<any> = new Observable()
  public spinner: boolean = false;
  public notyf: Notyf;
  
  person = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService,
    private cookie:      CookieService,
    private router:      Router
  ){
    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }

  login(){
    if(!this.person.valid){
      return;
    }
    this.spinner = true;

    this.http$ = this.authService.login(this.person.value)
    this.http$.subscribe({
      next: (data) => {
        this.spinner = false;
        this.cookie.set('token', data.token, 30)
        this.cookie.set('name', data.name, 30)
        this.cookie.set('role', data.role, 30)
        this.cookie.set('img', data.img, 30)
        this.cookie.set('id', data.user_id, 30)

        this.notyf.success("Logado com sucesso!");
        this.router.navigate(['/'])

      },
      error: (error: any) => {
        console.log(error);
        this.spinner = false;
      }
    })
  }

  get email(): AbstractControl {
    return this.person.get('email')!;
  }

  get password(): AbstractControl {
    return this.person.get('password')!;
  }

}

import { Component } from '@angular/core';

// MDBootstrap
import { MdbRippleModule }  from 'mdb-angular-ui-kit/ripple';
import { MdbFormsModule }   from 'mdb-angular-ui-kit/forms';

// Components
import { HeaderComponent }  from  '@components/header/header.component';
import { SidebarComponent } from  '@components/sidebar/sidebar.component';
import { Observable, ReplaySubject } from 'rxjs';
import { UserService } from '@services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, MdbFormsModule, MdbRippleModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export default class ProfileComponent {

  http$: Observable<any> = new Observable()
  userId: string = this.cookieService.get('id');
  image: string;
  changePassword: boolean = false;
  notyf: Notyf;

  form: FormGroup = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required]),
    role: new FormControl({value: "", disabled: true}, [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    rm: new FormControl("", [Validators.required])
  })


  constructor(
    private userService: UserService,
    private cookieService: CookieService
  ){
    
  }

  ngOnInit(){
    this.getUserById();

    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }

  getUserById(){
    this.http$ = this.userService.getItem(this.userId)
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.form.patchValue({
            id: data.body.id,
            name: data.body.name,
            role: data.body.role,
            email: data.body.email,
            rm: data.body.rm
          })

          if(data.body.image){
            this.image = data.body.image
          }
        }
        console.log(data)
      }
    })
  }

  changeInputFile(inp: any)
  {
    console.log(inp.files)
    if(inp.files && inp.files[0])
    {
      const result = new ReplaySubject<string>(1);
      const file = inp.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target && ev.target.result)
        {
          this.image = ev.target.result.toString();
        }
      }

    }
  }

  updateInfo(){
    const params = {
      user: this.form.getRawValue(),
      image: this.image
    }

    this.http$ = this.userService.updateItem(this.userId, params)
    this.http$.subscribe({
      next: (data) => {
        console.log(data)
        if(data.status){
          this.notyf.success(data.message)
        }else{
          this.notyf.error(data.message)
        }
      }
    })
  }

}

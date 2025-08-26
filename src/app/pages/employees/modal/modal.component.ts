import { Component }        from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';

// MDBootstrap
import { MdbFormsModule }    from 'mdb-angular-ui-kit/forms';
import { MdbModalModule }    from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule }   from 'mdb-angular-ui-kit/ripple';
import { MdbModalRef }       from 'mdb-angular-ui-kit/modal';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';

// Services
import { UserService } from '@services/user.service';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MdbModalModule, MdbFormsModule, MdbRippleModule, MdbCheckboxModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  
  private fb: FormBuilder
  sending: boolean = false;
  http$: Observable<any> = new Observable();
  cpassword: string;
  id: string;
  
  public notyf: Notyf = new Notyf({
    position: {
      x: 'right',
      y: 'top'
    }
  });

  public user = new FormGroup({
    name:     new FormControl('', Validators.required),
    rm:      new FormControl(''),
    role:     new FormControl('', Validators.required),
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  })

  constructor(public modalRef: MdbModalRef<ModalComponent>, private service: EmployeeService) {}

  ngOnInit(){
    if(this.id){
      this.getItemById()
    }
  }

  getItemById(){
    this.http$ = this.service.getItem(this.id)
    this.http$.subscribe({
      next: (data) => {
        this.user.setValue({
          name:     data.body.name,
          rm:       data.body.rm,
          role:     data.body.role,
          email:    data.body.email,
          password: "",
        })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  postItem(){

    if(this.user.invalid){
      return;
    }

    if(this.id){

      const user = {
          name:     this.user.value?.name,
          rm:       this.user.value?.rm,
          role:     this.user.value?.role,
          email:    this.user.value?.email,
      }

      this.http$ = this.service.updateItem(this.id, user)

    }else{

      this.http$ = this.service.postItem({user: this.user.value})
    }
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.notyf.success(data.message)
          this.modalRef.close()
        }else{
          this.notyf.open(data.message)
        }
      },
    })

  }

}

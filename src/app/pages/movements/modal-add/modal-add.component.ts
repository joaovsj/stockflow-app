import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Observable } from 'rxjs';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notyf } from 'notyf';
import { ProductService } from '@services/product.service';
import { EmployeeService } from '@services/employee.service';
import { CookieService } from 'ngx-cookie-service';

import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { DatePipe } from '@angular/common';
import { MovementService } from '@services/movement.service';

@Component({
  selector: 'app-modal-add',
  standalone: true,
  imports: [MdbModalModule, MdbFormsModule, MdbRippleModule, MdbCheckboxModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.scss'
})
export class ModalAddComponent {

  http$: Observable<any> = new Observable();
  notyf: Notyf;
  movementId: string = ''

  today: any = new Date()

  products: any[];
  employees: any[];

  movement: FormGroup = new FormGroup({
    product_id: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    user_id: new FormControl({value: null, disabled: true}, [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    description: new FormControl(0, [Validators.required]),
    created_at: new FormControl({value: "", disabled: true}, [Validators.required]),
    type: new FormControl("E")
  })

  constructor(
    public modalRef: MdbModalRef<ModalComponent>,
    private movementService: MovementService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private datePipe: DatePipe
    ) {
    }

  ngOnInit(){
    this.getProducts()
    this.getEmployees()

    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });

    this.movement.get("created_at").setValue(this.datePipe.transform(this.today, 'yyyy-MM-ddTHH:mm'))
    console.log(this.datePipe.transform(this.today, 'yyyy-MM-ddTHH:mm'))
  }

  getMovementById(){
    this.http$ = this.movementService.getItem(this.movementId)
    this.http$.subscribe({
      next: (data) => {
        console.log(data)
        if(data.status){
          data.body.created_at = data.body.created_at.split('.')[0]
          this.movement.patchValue(data.body)
          console.log(this.movement)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  select_product(input?: HTMLInputElement){
    let product = this.products.find((p) => input.value == p.id)
  
    if(product){
      input.value = product.name
    }else{
      this.notyf.error("Esse produto não existe");
      input.value = "";
    }
  }

  getEmployees(){
    this.http$ = this.employeeService.getItems();
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.employees = data.body
          let user = this.employees.find((e) => e.name == this.cookieService.get('name'))
          console.log(user)
          this.movement.get('user_id').setValue(user.id)
        }
      }
    })
  }

  getProducts(){
    this.http$ = this.productService.getItems();
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.products = data.body
          if(this.movementId){
            this.getMovementById();
          }
        }
      }
    })
  }

  changeDate(){
    if(this.movement.get('created_at').disabled){
      this.movement.get('created_at').enable()
    }else{
      this.movement.get('created_at').disable()
      this.movement.get('created_at').setValue(this.datePipe.transform(this.today, 'yyyy-MM-ddTHH:mm'))
    }
  }

  addMovement(){
    if(this.movement.valid){
      console.log(this.movement.getRawValue())
      if(!this.movementId){
        this.http$ = this.movementService.postItem(this.movement.getRawValue());
      }else{
        this.http$ = this.movementService.updateItem(this.movementId, this.movement.getRawValue());
      }
      this.http$.subscribe({
        next: (data) => {
          if(data.status){
            this.notyf.success(data.message)
            this.modalRef.close()
          }else{
            this.notyf.error(data.message)
          }
        }
      })
    }
  }

}

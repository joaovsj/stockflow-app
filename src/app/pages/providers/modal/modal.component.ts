import { Component } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '@services/address.service';
import { Observable } from 'rxjs';
import { Notyf } from 'notyf';

// MDBootstrap
import { MdbFormsModule }    from 'mdb-angular-ui-kit/forms';
import { MdbModalModule }    from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule }   from 'mdb-angular-ui-kit/ripple';
import { MdbModalRef }       from 'mdb-angular-ui-kit/modal';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';

// Services
import { ProviderService } from '@services/provider.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MdbModalModule, MdbFormsModule, MdbRippleModule, MdbCheckboxModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalProviderComponent {
  
  http$: Observable<any>
  id: string;
  sending: boolean = false;

  notyf: Notyf = new Notyf({
    position: {
      x: 'right',
      y: 'top'
    }
  });

  form = new FormGroup({
    provider: new FormGroup({
      name: new FormControl('', Validators.required),
      document: new FormControl('', Validators.required),
      cellphone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    }),
    address: new FormGroup({
      cep: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      neighborhood: new FormControl('', Validators.required),
    })
  })

  get provider() { return this.form.get('provider') as FormGroup}
  get address() { return this.form.get('address') as FormGroup}
  
  constructor(
    public modalRef: MdbModalRef<ModalProviderComponent>,
    private addressService: AddressService,
    private providerService: ProviderService,
  ) {
    this.address.get('cep').valueChanges.subscribe(change => this.getAddress(change))
  }
  
  ngOnInit(){
    if(this.id){
      this.getItemById()
    }
    console.log(this.id)
  }

  getItemById(){
    this.http$ = this.providerService.getItem(this.id)
      this.http$.subscribe({
        next: (data) => {
          if(data.status){
            this.provider.setValue({
              name: data.body.provider.name,
              document: data.body.provider.document,
              cellphone: data.body.provider.cellphone,
              email: data.body.provider.email,
            })
            this.address.setValue({
              cep: data.body.address.cep,
              street: data.body.address.street,
              number: data.body.address.number,
              city: data.body.address.city,
              state: data.body.address.state,
              neighborhood: data.body.address.neighborhood,
            })
          }
        },
        error: (error) => {
          console.log(error)
        }
      })
  }

  getAddress(value: any){
    let cep = value
    if(cep.length == 8){
      this.http$ = this.addressService.getAddress(cep)
      this.http$.subscribe({
        next: (data) => {
          console.log(data)
          this.address.get('street').setValue(data.logradouro)
          this.address.get('city').setValue(data.localidade)
          this.address.get('state').setValue(data.uf)
          this.address.get('neighborhood').setValue(data.bairro)
        },
        error: (error) => {
        this.notyf.error("Erro ao conectar com o servidor")
        }
      })

    }
  }

  postProvider(){
    console.log(this.form.value);
    
    if(this.form.valid){
      this.sending = true;
      if(this.id){
        this.http$ = this.providerService.updateItem(this.id, this.form.value)
      }else{
        this.http$ = this.providerService.postItem(this.form.value)
      }
      this.http$.subscribe({
        next: (data) => {
          console.log(data);
          this.sending = false;
          if(data.status){
            this.notyf.success(data.message)
            this.modalRef.close()
          }else{
            this.notyf.open(data.message)
          }
        },
        error: (error) => {
          console.log(error)
          this.notyf.error("Erro ao conectar com servidor")
          this.sending = false;
        }
      })
    }else{
      console.log(this.form.errors)
    }
  }

}

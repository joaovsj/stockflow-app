import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notyf } from 'notyf';

// MDBootstrap
import { MdbFormsModule }   from 'mdb-angular-ui-kit/forms';
import { MdbModalModule }   from 'mdb-angular-ui-kit/modal';
import { MdbModalRef }      from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule }  from 'mdb-angular-ui-kit/ripple';

// Services
import { CategoryService }  from '@services/category.service';
import { ProviderService }  from '@services/provider.service';
import { UnityService }     from '@services/unity.service';
import { ProductService } from '@services/product.service';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MdbModalModule, MdbFormsModule, MdbRippleModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  private http$: Observable<any> = new Observable();
  public  categories = [];
  public  unities    = [];
  public  providers  = [];
  public  notyf:  Notyf;
  public  spinner: boolean = false;
  public productId: string;
  
  // Form's fields
  public product = new FormGroup({
    name:         new FormControl(null, Validators.required),
    category_id:  new FormControl(null, Validators.required),
    unity_id:     new FormControl(null, Validators.required),
    provider_id:  new FormControl(null, Validators.required),
    minimum:      new FormControl(null, Validators.required),
    maximum:      new FormControl(null, Validators.required),
    quantity:     new FormControl(null, [Validators.required, Validators.min(1)]),
  });

  get name(){ return this.product.get('name') as FormControl};
  get minimum(){ return this.product.get('minimum') as FormControl};
  get maximum(){ return this.product.get('maximum') as FormControl};
  get quantity(){ return this.product.get('quantity') as FormControl};

  constructor(
    public modalRef:          MdbModalRef<ModalComponent>,
    private categoryService:  CategoryService,
    private unityService:     UnityService,
    private providerService:  ProviderService,
    private productService:   ProductService
  ) {

    this.getcategories();
    this.getUnities();
    this.getProviders();

    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }

  ngOnInit(){
    if(this.productId){
      this.getProduct();
    }
  }

  getProduct(){
    this.http$ = this.productService.getItem(this.productId);
    this.http$.subscribe({
      next: (data) => {
        console.log(data)
        delete data.body.id;
        this.product.setValue({
          name:         data.body.name,
          category_id:  data.body.category_id,
          unity_id:     data.body.unity_id,
          provider_id:  data.body.provider_id,
          minimum:      data.body.minimum,
          maximum:      data.body.maximum,
          quantity:     data.body.quantity,
        })
      },
      error: (error) => {
        console.log(error)
        this.notyf.error("Erro ao conectar com o servidor")
      }
    })
  }

  public getcategories(){
    this.http$ = this.categoryService.getItems();
    this.http$.subscribe({
      next: (data) => {
        if(data.body){
          this.categories = data.body
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  
  public getUnities(){
    this.http$ = this.unityService.getItems();
    this.http$.subscribe({
      next: (data) => {
        if(data.body){
          this.unities = data.body
        }
     },
      error: (error) => {
        console.log(error)
      }
    })
  }

  
  public getProviders(){
    this.http$ = this.providerService.getItems();
    this.http$.subscribe({
      next: (data) => {
        if(data.body){
          this.providers = data.body
        }
     },
      error: (error) => {
        console.log(error)
      }
    })
  }

  public register(){
    this.spinner = true;
    
    if(this.productId){
      this.update();
      return;
    }


    this.http$ = this.productService.postItem(this.product.value);
    this.http$.subscribe({
      next: (data: any) => {
        this.spinner = false;

        if(data.status){
          this.finalizeTask(data.message);
        }

      },
      error: (error) => {
        this.spinner = false;
        console.log(error)
      }
    })
  }

  private update(){
    console.log(this.product.value);

    this.http$ = this.productService.updateItem(this.productId, this.product.value);
    this.http$.subscribe({
      next: (data: any) => {
        if(data.status){
          this.finalizeTask(data.message);
        }

      },
      error: (error) => {
        console.log(error)
      }
    })
        
    this.spinner = false;
  }

  private finalizeTask(message: string){

    this.notyf.success(message);
    this.closeModal();
    this.productService.done(); 
  }

  public closeModal(){
    this.modalRef.close();
  }
}

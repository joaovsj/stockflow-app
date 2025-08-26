import { Component }    from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators }  from '@angular/forms';
import { Observable }   from 'rxjs';
import { Notyf } from 'notyf';

// MDBootstrap
import { MdbFormsModule  }              from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule }              from 'mdb-angular-ui-kit/ripple';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbDropdownModule }            from 'mdb-angular-ui-kit/dropdown';

// Components
import { HeaderComponent }        from '@components/header/header.component';
import { SidebarComponent }       from '@components/sidebar/sidebar.component';
import { TableComponent }         from '@components/table/table.component';
import { ConfirmComponent }       from '@components/confirm/confirm.component';
import { ModalComponent }         from '../modal/modal.component';
import { ModalCategoryComponent } from '../modal-category/modal-category.component';
import { ModalUnityComponent }    from '../modal-unity/modal-unity.component';

// Services
import { ProductService } from '@services/product.service';
import { ConfirmService } from '@services/confirm.service';
import { CategoryService } from '@services/category.service';



@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, TableComponent, FormsModule, MdbFormsModule, MdbRippleModule, MdbDropdownModule, ConfirmComponent, ReactiveFormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {

  public http$:     Observable<any> = new Observable();
  public modalRef:  MdbModalRef<ModalComponent | ModalCategoryComponent | ModalUnityComponent> | null = null;
  public name:      string;
  public categories:  string;
  public products:  any[] = [];
  
  public  product:   any[] = [];
  public  notyf:     Notyf;
  private reloadList: any; 
  public  confirm:   boolean = false;
  public  itemsToDelete: any = [];
  public  resetList: boolean = false;

  public headers: string[] = ['Nome', 'Quantidade', 'Status', 'Mínimo', 'Máximo', "Categoria", "Fornecedor"]; // Esse
  public indexes: string[] = ["id", "name", "quantity", "status", "minimum", "maximum", "category", "provider", "id"]; 

  // Search's fields
  public searchFields = new FormGroup({
    name:         new FormControl(null),
    category:     new FormControl(null),
  });

  constructor(
    private productService:   ProductService,
    private categoryService:  CategoryService,
    private modalService:     MdbModalService,
    private confirmService:   ConfirmService
  ){}

  ngOnInit(){
    this.getProducts();
    this.getCategories();
    this.realodList();    

    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }


  public search(){

    let name     = this.searchFields.value?.name     == null  ? "": this.searchFields.value?.name
    let category = this.searchFields.value?.category == null  ? "": this.searchFields.value?.category
    this.http$ = this.productService.searchItem(
      name, 
      category
    )

    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.products = data.body
        }
      },
      error: (error) => {
        console.log(error)
      }
    })

  }

  private realodList(){
    this.reloadList = this.productService.registerDone$;
    this.reloadList.subscribe({
      next: (status: boolean) => {
        if(status){
          this.getProducts();
        }         
      } 
    });
  }

  getCategories(){
    this.http$ = this.categoryService.getItems()
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.categories = data.body
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


  getProducts(){
    this.http$ = this.productService.getItems()
    this.http$.subscribe({
      next: (data) => {



        if(data.status){

          const allProducts = data.body

          allProducts.forEach((product: any) => {

            if(product.quantity <= product.minimum){
              product.status = `<span class="badge rounded-pill badge-danger">Comprar</span>`;
            }else if(product.quantity < (product.minimum + (product.minimum * 0.25))){
              product.status = `<span class="badge rounded-pill badge-warning">Verificar</span>`;
            }else{
              product.status = `<span class="badge rounded-pill badge-success">Em estoque</span>`;
            }
          });

          this.products = allProducts


        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  openModal(type: string){

    switch (type) {
      case 'product':
        this.modalRef = this.modalService.open(ModalComponent)
        break;

      case 'category':
        this.modalRef = this.modalService.open(ModalCategoryComponent)
        break;
      case 'unity':
        this.modalRef = this.modalService.open(ModalUnityComponent)
        break;
      default:
        break;
    }


    if(type == 'add'){
    }

  }

  public async editProduct(event: Event){

    //const product: any = await this.getProduct(event);  

    this.modalRef = this.modalService.open(ModalComponent, {
      data: { 
        productId: event
      }
    });


  }
  
  private getProduct(id: any){
    return new Promise(resolve => {
      this.productService.getItem(id).subscribe({
        next: (data: any) => {
          if(data.status){
            const product = data.body;
            console.log(product[0]);
            resolve(product[0]);
          }
        },
        error: (error) => {
          console.log(error)
          resolve(false);
        }
      })  
    });
  }


  openDeleteModal(){

    if(this.itemsToDelete.length == 0){
      this.notyf.error('Selecione algum item para exclusão!');
      return;
    } 

    this.confirmService.show();
  }

  public getItemsToDelete(event: any){

    if(event == false){
      this.itemsToDelete = []; return;
    }

    this.itemsToDelete = event;
  }

  public deleteItems(event: Event){
    if(!event){
      return;
    }

    this.http$ = this.productService.deleteAll(this.itemsToDelete)
    this.http$.subscribe({
      next: (data: any) => {
        this.deleteDone();
        if(data){
          this.notyf.success(data.message);
        }      
      },
      error: (error) => {
        this.deleteDone();
        if(!error.status){
          this.notyf.error(error.message);
        }
      },
    })
  }

  private deleteDone(){
    this.getProducts();
    this.itemsToDelete = [];
    this.resetList     = true;
  }
}

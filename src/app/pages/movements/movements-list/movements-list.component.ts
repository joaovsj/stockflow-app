import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// MDBootstrap
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

// Components
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { HeaderComponent }  from '@components/header/header.component';
import { TableComponent }   from '@components/table/table.component';
import { CategoryService } from '@services/category.service';
import { Observable } from 'rxjs';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { ModalAddComponent } from '../modal-add/modal-add.component';
import { ModalRemoveComponent } from '../modal-remove/modal-remove.component';
import { MovementService } from '@services/movement.service';
import { Notyf } from 'notyf';
import { ConfirmComponent } from '@components/confirm/confirm.component';
import { ConfirmService } from '@services/confirm.service';

@Component({
  selector: 'app-movements-list',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, ConfirmComponent, MdbFormsModule, MdbRippleModule, MdbDropdownModule, RouterLink, TableComponent, ModalAddComponent, ModalRemoveComponent],
  templateUrl: './movements-list.component.html',
  styleUrl: './movements-list.component.scss'
})
export class MovementsListComponent {

  modalRef: MdbModalRef<ModalAddComponent> | MdbModalRef<ModalRemoveComponent> | null = null;

  categories: any[];
  http$: Observable<any> = new Observable();
  notyf: Notyf;
  resetList: boolean = false;

  public headers = ["Produto", "Categoria", "Unidade", "Quantidade", "Responsável", "Data", "Movimentação"]; // Esse
  public indexes = ["id", "product", "category", "unity", "quantity", "user", "created_at", "type", "id"]; 
  public data: any[];
  itemsToDelete: any[];

  constructor(
    private modalService: MdbModalService,
    private categoryService: CategoryService,
    private movementService: MovementService,
    private confirmService: ConfirmService
  ){}

  ngOnInit(){
    this.getCategories()
    this.getMovements()

    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }

  getMovements(){
    this.http$ = this.movementService.getItems()
    this.http$.subscribe({
      next: (data) => {
        const allData = data.body;
        allData.forEach((item: any) => {

          if(item.type == "E"){
            item.type = `
              <span class="badge rounded-pill badge-success">Entrada</span>
            `;
          } 

          if(item.type == "S"){
            item.type = `
              <span class="badge rounded-pill badge-danger">Saída</span>
            `;
          }
        });

        this.data = data.body
      }
    })
  }

  getCategories(){
    this.http$ = this.categoryService.getItems()
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.categories = data.body
        }
      }
    })
  }

  openModal(type: string){

    switch (type) {
      case 'add':
        this.modalRef = this.modalService.open(ModalAddComponent);
        this.modalRef.onClose.subscribe({
          next: () => {
            this.getMovements()
          }
        })
        break;
      case 'remove':
        this.modalRef = this.modalService.open(ModalRemoveComponent)
        this.modalRef.onClose.subscribe({
          next: () => {
            this.getMovements()
          }
        })
        break;
      default:
        break;
    }
  }

  public async editProduct(event: Event){

    this.modalRef = this.modalService.open(ModalAddComponent, {
      data: {
        movementId: event
      }
    })
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

    this.http$ = this.movementService.deleteAll(this.itemsToDelete)
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
    this.getMovements();
    this.itemsToDelete = [];
    this.resetList     = true;
  }  

  searchItems(){

  }
}

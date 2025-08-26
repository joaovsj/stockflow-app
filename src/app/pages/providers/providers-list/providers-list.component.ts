import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs'
import { Notyf } from 'notyf';

// MDBootstrap
import { MdbFormsModule }   from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule }  from 'mdb-angular-ui-kit/ripple';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

// Components
import { HeaderComponent }  from '@components/header/header.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { TableComponent }   from '@components/table/table.component';
import { ModalProviderComponent }   from '../modal/modal.component';
import { ConfirmComponent } from '@components/confirm/confirm.component';

// Services
import { ProviderService } from '@services/provider.service';
import { ConfirmService } from '@services/confirm.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-providers-list',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, TableComponent, FormsModule, MdbFormsModule, MdbRippleModule, ModalProviderComponent, ConfirmComponent, NgxMaskDirective],
  templateUrl: './providers-list.component.html',
  styleUrl: './providers-list.component.scss'
})
export class ProvidersListComponent {

  http$: Observable<any> = new Observable();
  modalRef: MdbModalRef<ModalProviderComponent> | null = null;

  name: string = "";
  doc: string = "";
  notyf: Notyf;
  reloadList: any;
  confirm: boolean = false;
  itemsToDelete: any = [];
  resetList: boolean = false;

  headers: any[] = [
    'Nome', 'CPF/CPNJ', 'Telefone/Celular', 'Ativo'
  ];

  indexes: any[] = ['id', 'name', 'document', 'cellphone', 'disabled', "id"]

  providers: any[] = [];

  constructor(
    private service: ProviderService,
    private modalService: MdbModalService,
    private confirmService: ConfirmService
  ){

  }

  ngOnInit(){
    this.getProviders();
    this.realodList();

    this.notyf = new Notyf({
      position: {
        x: 'right',
        y: 'top'
      }
    })
  }

  getProviders(){
    this.http$ = this.service.getItems()
    this.http$.subscribe({
      next: (data) => {


        const allData = data.body;
        allData.forEach((item: any) => {

          if(item.disabled == 0){
            item.disabled = `
              <span class="badge rounded-pill badge-success">Ativo</span>
            `;
          } 

          if(item.disabled == 1){
            item.disabled = `
              <span class="badge rounded-pill badge-danger">Inativo</span>
            `;
          }

          // console.log(item);
        });
        

        // console.log(data.body);

        this.providers = data.body
      },
      error: (error) => {
        console.log(error)
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

  getItemsToDelete(event: any){
    if(event == false){
      this.itemsToDelete = []; return;
    }

    this.itemsToDelete = event
  }

  deleteItems(event: Event){
    if(!event){
      return;
    }

    this.http$ = this.service.deleteAll(this.itemsToDelete);
    this.http$.subscribe({
      next: (data) => {
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
    this.getProviders();
    this.itemsToDelete = [];
    this.resetList = true;
  }

  edit(event: Event){
    this.modalRef = this.modalService.open(ModalProviderComponent, {data: { id: event}})
    this.modalRef.onClose.subscribe(() => this.getProviders())
  }

  openAddModal(){
    this.modalRef = this.modalService.open(ModalProviderComponent)
    this.modalRef.onClose.subscribe(() => this.getProviders())
  }

  searchItems(){
    this.http$ = this.service.searchItems({document: this.doc, name: this.name})
    this.http$.subscribe({
      next: (data) => {
        const allData = data.body;
        allData.forEach((item: any) => {
  
          if(item.disabled == 0){
            item.disabled = `
              <span class="badge rounded-pill badge-success">Ativo</span>
            `;
          } 
  
          if(item.disabled == 1){
            item.disabled = `
              <span class="badge rounded-pill badge-danger">Inativo</span>
            `;
          }
  
          // console.log(item);
        });
        this.providers = data.body  
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  private realodList(){
    this.reloadList = this.service.registerDone$;
    this.reloadList.subscribe({
      next: (status: boolean) => {
        if(status){
          this.getProviders();
        }         
      } 
    });
  }

}
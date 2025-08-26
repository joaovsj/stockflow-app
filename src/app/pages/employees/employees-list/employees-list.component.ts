import { FormsModule, NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Notyf } from 'notyf';

// MDBootstrap
import { MdbFormsModule }   from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule }  from 'mdb-angular-ui-kit/ripple';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

// Components
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { HeaderComponent }  from '@components/header/header.component';
import { TableComponent }   from '@components/table/table.component';
import { ModalComponent }   from '../modal/modal.component';

// Services
import { EmployeeService }  from '@services/employee.service';
import { ConfirmComponent } from '@components/confirm/confirm.component';

import { ConfirmService } from '@services/confirm.service';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, TableComponent, MdbFormsModule, MdbRippleModule, RouterLink, FormsModule, ModalComponent, ConfirmComponent],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent {

  http$: Observable<any> = new Observable()
  modalRef: MdbModalRef<ModalComponent> | null = null;

  name: string = ''
  doc: string = ''
  notyf: Notyf;
  private reloadList: any;
  confirm: boolean = false;
  itemsToDelete: any = [];
  resetList: boolean = false;

  page: number = 0
  currentPage: number = 1

  public headers = ["Nome", "Cargo", "RM", "Email", "Ativo"]; // Esses Headers serão dinamicos
  public indexes = ["id", "name", "role", "rm", "email", "disabled", "id"]; // Esses Headers serão dinamicos
  public employess = []

  constructor(
    private service: EmployeeService,
    private modalService: MdbModalService,
    private confirmService: ConfirmService
  ){

  }

  ngOnInit(){
    this.getEmployees()
    this.realodList();

    this.notyf = new Notyf({
      position: {
        x: 'right',
        y: 'top'
      }
    })
  }

  getEmployees(){
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
        this.employess = data.body
      },
      error: (error) => {
        console.log(error)
        alert("Deu erro")
      }
    })
  }

  searchEmployees(){
    this.http$ = this.service.searchItems({name: this.name, rm: this.doc})
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
        
        this.employess = data.body;
      }
    })
  }

  edit(event: Event){
    this.modalRef = this.modalService.open(ModalComponent, { data: { id: event}})
    this.modalRef.onClose.subscribe(() => this.getEmployees())
  }

  openAddModal(){
    this.modalRef = this.modalService.open(ModalComponent)
    this.modalRef.onClose.subscribe(() => this.getEmployees())
  }

  private realodList(){
    this.reloadList = this.service.registerDone$;
    this.reloadList.subscribe({
      next: (status: boolean) => {
        if(status){
          this.getEmployees()
        }
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
      }
    })
  }

  private deleteDone(){
    this.getEmployees();
    this.itemsToDelete = [];
    this.resetList = true;
  }
}

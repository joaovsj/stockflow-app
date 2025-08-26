import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Notyf } from 'notyf';  

// MDBootstrap
import { MdbFormsModule }   from 'mdb-angular-ui-kit/forms';
import { MdbModalModule }   from 'mdb-angular-ui-kit/modal';
import { MdbModalRef }      from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule }  from 'mdb-angular-ui-kit/ripple';

// Services
import { CategoryService } from '@services/category.service';

@Component({
  selector: 'app-modal-category',
  standalone: true,
  imports: [MdbModalModule, MdbFormsModule, MdbRippleModule],
  templateUrl: './modal-category.component.html',
  styleUrl: './modal-category.component.scss'
})
export class ModalCategoryComponent {

  http$: Observable<any> = new Observable();
  public spinner: boolean = false;
  public notyf: Notyf;
  public categories = [];

  constructor(
    public modalRef: MdbModalRef<ModalCategoryComponent>,
    private categoryService: CategoryService
  ) {
    this.getCategories();
    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }

  public addNewCategory(name: string){
    this.spinner = true;
    this.http$ = this.categoryService.postItem({name: name});
    this.http$.subscribe({
      next: (data) => {
        this.spinner = false;

        if(data.status){
          this.notyf.success(data.message);
          this.getCategories();
        }
      },
      error: (error) => {
        this.spinner = false;
        console.log(error)
      }, 
    })
  }

  public getCategories(){
    this.http$ = this.categoryService.getItems();
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.categories = data.body;
        }
     },
      error: (error) => {
        console.log(error)
      }
    })
  }

  public removeCategory(id: string){
    this.http$ = this.categoryService.deleteItem(id);
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.getCategories();
        }
     },
      error: (error) => {
        console.log(error)
      }
    })
  }
}

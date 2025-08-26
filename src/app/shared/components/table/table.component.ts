import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, Output, QueryList, ViewChildren, EventEmitter } from '@angular/core';
import { NgxMaskPipe } from 'ngx-mask';

// MDBootstrap
import { MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgxMaskPipe, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnChanges{
  
  public currentPage: number = 1
  public items = [];
  public deleteAllItems: boolean = false;

  @Input() public headers     = []; 
  @Input() public indexes     = [];
  @Input() public data: any   = [];
  @Input() public resetItemsToDelete: boolean = false;
  
  @Output() public id = new EventEmitter();
  @Output() public itemsToDelete = new EventEmitter();

  @ViewChildren('check') public checkboxes!: QueryList<ElementRef>;

  public showEditModal(id: any){
    this.id.emit(id);
  }

  public addItem(id: any){
    if(this.items.includes(id)){

      let index = this.items.indexOf(id);
      this.items.splice(index, 1);

    } else{
      this.items.push(id);  
    }
    
    this.itemsToDelete.emit(this.items);
  }

  ngOnChanges(){

    if(this.resetItemsToDelete){
      this.items = [];
      this.disableCheckBoxes();
    }
  }
  

  public deleteAll(event: Event){
    const input = event.target as HTMLInputElement;  

    if(!input.checked){
      this.itemsToDelete.emit(false);
      this.disableCheckBoxes();  
      this.items = [];
      return;
    }

    this.enableCheckboxes();
    
    this.data.forEach((item: any) => {
      this.items.push(item.id);  
    });
   
    this.itemsToDelete.emit(this.items);
  }  


  private disableCheckBoxes(){
    this.checkboxes.forEach((checkbox) => {
      checkbox.nativeElement.checked = false;
    });   
  }

  private enableCheckboxes(){
    this.checkboxes.forEach((checkbox) => {
      checkbox.nativeElement.checked = true;
    });   
  }

  
  

}

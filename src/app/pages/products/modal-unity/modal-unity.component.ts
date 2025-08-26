import { Component } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';

// MDBootstrap
import { MdbFormsModule }   from 'mdb-angular-ui-kit/forms';
import { MdbModalModule }   from 'mdb-angular-ui-kit/modal';
import { MdbModalRef }      from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule }  from 'mdb-angular-ui-kit/ripple';


// Services
import { UnityService } from '@services/unity.service';

@Component({
  selector: 'app-modal-unity',
  standalone: true,
  imports: [MdbModalModule, MdbFormsModule, MdbRippleModule],
  templateUrl: './modal-unity.component.html',
  styleUrl: './modal-unity.component.scss'
})
export class ModalUnityComponent {
  http$: Observable<any> = new Observable();
  public spinner: boolean = false;
  public notyf: Notyf;
  public units = [];

  constructor(
    public modalRef: MdbModalRef<ModalUnityComponent>,
    private unityService: UnityService
  ) {
    this.getUnits();
    this.notyf  = new Notyf({
      position: {
        x: 'right',
        y: 'top',
      }
    });
  }

  public addNewUnity(name: string){

    this.spinner = true;
    this.http$ = this.unityService.postItem({name: name});
    this.http$.subscribe({
      next: (data) => {
        this.spinner = false;

        if(data.status){
          this.notyf.success(data.message);
          this.getUnits();
        }
      },
      error: (error) => {
        this.spinner = false;
        console.log(error)
      }, 
    })
  }

  public getUnits(){
    this.http$ = this.unityService.getItems();
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.units = data.body;
        }
     },
      error: (error) => {
        console.log(error)
      }
    })
  }

  public removeUnity(id: string){
    this.http$ = this.unityService.deleteItem(id);
    this.http$.subscribe({
      next: (data) => {
        if(data.status){
          this.getUnits();
        }
     },
      error: (error) => {
        console.log(error)
      }
    })
  }
  
}

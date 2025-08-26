import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  public active$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  public show(){
    this.active$.next(true);
  }

  public close(){
    this.active$.next(false);
  }
}

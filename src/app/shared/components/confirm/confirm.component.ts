import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, inject } from '@angular/core';

// Services
import { ConfirmService } from '@services/confirm.service';


@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  animations: [
    trigger('showsUp', [
      transition(':enter', animate('.2s', keyframes([  
        style({   
          opacity: 0,
          transform: 'translateX(80px)'
        }),
        style({   
          opacity: 1,
          transform: 'translateX(0px)'
        })
      ]))), 
    ])
  ]
})
export class ConfirmComponent {

  public status = inject(ConfirmService);

  @Output() public confirm: any = new EventEmitter();
  
  public choose(choose: boolean){
    this.status.close();

    if(choose){
      this.confirm.emit(choose);
    }
  }

}

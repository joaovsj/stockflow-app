import { Component } from '@angular/core';

// MDBootstrap
import { MdbFormsModule }    from 'mdb-angular-ui-kit/forms';
import { MdbModalModule }    from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule }   from 'mdb-angular-ui-kit/ripple';
import { MdbModalRef }       from 'mdb-angular-ui-kit/modal';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MdbModalModule, MdbFormsModule, MdbRippleModule, MdbCheckboxModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}
}

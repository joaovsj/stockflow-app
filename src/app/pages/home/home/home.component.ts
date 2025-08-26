import { Component } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faParachuteBox } from '@fortawesome/free-solid-svg-icons';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { ModalComponent } from '../../movements/modal/modal.component';
import { ModalRemoveComponent } from '../../movements/modal-remove/modal-remove.component';
import { ModalAddComponent } from '../../movements/modal-add/modal-add.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  parachute = faParachuteBox

  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(
    private modalService: MdbModalService
  ){

  }

  openAddModal(){
    this.modalRef = this.modalService.open(ModalAddComponent)
  }

  openRemoveModal(){
    this.modalRef = this.modalService.open(ModalRemoveComponent)
  }
}

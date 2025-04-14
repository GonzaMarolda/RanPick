import { Component, inject, input } from '@angular/core';
import { ModalService } from '../../../services/ModalService';

@Component({
  selector: 'auth-modal',
  imports: [],
  templateUrl: './authModal.component.html',
  styleUrl: './authModal.component.scss'
})
export class AuthModalComponent {
  modalService = inject(ModalService)
  isLogin = input.required<boolean>()

  onClickOutside(event: Event) {
    if (event.target !== event.currentTarget) return
    this.modalService.close()
  }
}

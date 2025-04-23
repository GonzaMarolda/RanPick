import { Component, inject, input } from '@angular/core';
import { ModalService } from '../../../services/ModalService';

@Component({
  selector: 'confirm-modal',
  imports: [],
  templateUrl: './confirmModal.component.html',
  styleUrl: './confirmModal.component.scss'
})
export class ConfirmationModalComponent {
    modalService = inject(ModalService)
    confirmation = input.required<{
        name: string,
        nameColor: string,
        headerText: string,
        bodyText: string,
        confirmFunc: () => void
    }>()
    closeFunc = input<() => void>()

    close() {
        if (this.closeFunc()) {
            this.closeFunc()!()
        } else {
            this.modalService.close()
        } 
    }
}
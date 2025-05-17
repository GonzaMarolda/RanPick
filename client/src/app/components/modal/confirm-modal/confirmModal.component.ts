import { Component, inject, input } from '@angular/core';
import { ModalService } from '../../../services/ModalService';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'confirm-modal',
  imports: [TranslateModule],
  templateUrl: './confirmModal.component.html',
  styleUrl: './confirmModal.component.scss'
})
export class ConfirmationModalComponent {
    modalService = inject(ModalService)
    translate = inject(TranslateService)
    confirmation = input.required<{
        nameId: string,
        nameColor: string,
        headerTextId: string,
        headerDynamicName: string,
        bodyTextId: string,
        bodyDynamicName: string,
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
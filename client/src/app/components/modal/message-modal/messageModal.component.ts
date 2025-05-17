import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../services/ModalService';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'message-modal',
  imports: [TranslateModule],
  templateUrl: './messageModal.component.html',
  styleUrl: './messageModal.component.scss'
})
export class MessageModalComponent implements OnInit {
    modalService = inject(ModalService)
    translate = inject(TranslateService)
    messageId = input.required<string>()
    dissapearActive = signal<boolean>(false)

    ngOnInit(): void {
        setTimeout(() => {
            this.dissapearActive.set(true)
        }, 600)
    }
}
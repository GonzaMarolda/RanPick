import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../services/ModalService';

@Component({
  selector: 'message-modal',
  imports: [],
  templateUrl: './messageModal.component.html',
  styleUrl: './messageModal.component.scss'
})
export class MessageModalComponent implements OnInit {
    modalService = inject(ModalService)
    message = input.required<string>()
    dissapearActive = signal<boolean>(false)

    ngOnInit(): void {
        setTimeout(() => {
            this.dissapearActive.set(true)
        }, 600)
    }
}
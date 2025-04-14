import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../services/ModalService';
import { AuthModalComponent } from '../modal/auth-modal/authModal.component';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss'
})
export class HeaderComponent {
    modalService = inject(ModalService)

    openAuth(isLogin: boolean) {
        this.modalService.open<AuthModalComponent>(AuthModalComponent, { isLogin: isLogin })
    }
}
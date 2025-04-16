import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../services/ModalService';
import { AuthModalComponent } from '../modal/auth-modal/authModal.component';
import { AuthService } from '../../services/AuthService';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss'
})
export class HeaderComponent {
    modalService = inject(ModalService)
    authService = inject(AuthService)

    openAuth(isLogin: boolean) {
        this.modalService.open<AuthModalComponent>(AuthModalComponent, { isLogin: isLogin })
    }
}
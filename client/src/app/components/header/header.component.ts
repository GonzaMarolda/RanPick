import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../services/ModalService';
import { AuthModalComponent } from '../modal/auth-modal/authModal.component';
import { AuthService } from '../../services/AuthService';
import { OpenModalComponent } from '../modal/open-modal/openModal.component';

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

    openOpen() {
        this.authService.user() ?
        this.modalService.open<OpenModalComponent>(OpenModalComponent) :
            this.openAuth(true)
    }

    saveWheel() {
        this.authService.user() ?
            console.log("Not implemented yet.") :
            this.openAuth(true)
    }
}
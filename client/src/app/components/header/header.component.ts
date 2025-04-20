import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../services/ModalService';
import { AuthModalComponent } from '../modal/auth-modal/authModal.component';
import { AuthService } from '../../services/AuthService';
import { OpenModalComponent } from '../modal/open-modal/openModal.component';
import { WheelService } from '../../services/WheelService';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss'
})
export class HeaderComponent {
    wheelService = inject(WheelService)
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
            this.wheelService.saveWheel().then((wheel) => {
                this.modalService.openMessageModal("The wheel has been saved successfully")
            }) :
            this.openAuth(true)
    }
}
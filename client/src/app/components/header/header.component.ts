import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../services/ModalService';
import { AuthModalComponent } from '../modal/auth/auth-modal/authModal.component';
import { AuthService } from '../../services/AuthService';
import { OpenModalComponent } from '../modal/open-modal/openModal.component';
import { WheelService } from '../../services/WheelService';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageDropdownComponent } from "../language/languageDropdown.component";

@Component({
    selector: 'app-header',
    imports: [TranslateModule, LanguageDropdownComponent],
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss'
})
export class HeaderComponent {
    wheelService = inject(WheelService)
    modalService = inject(ModalService)
    authService = inject(AuthService)
    translate = inject(TranslateService)

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
                this.modalService.openMessageModal("message.wheel-saved")
            }) :
            this.openAuth(true)
    }
}
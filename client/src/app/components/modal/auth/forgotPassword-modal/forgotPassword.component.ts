import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../../services/ModalService';
import { AuthInputComponent } from "../auth-input/authInput.component";
import { AuthModalComponent } from '../auth-modal/authModal.component';
import { AuthService } from '../../../../services/AuthService';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'forgot-password-modal',
  imports: [AuthInputComponent, TranslateModule],
  templateUrl: './forgotPassword.component.html',
  styleUrl: './forgotPassword.component.scss'
})
export class ForgotPasswordModalComponent {
  modalService = inject(ModalService)
  authService = inject(AuthService)
  translate = inject(TranslateService)
  email = signal<string>("")
  invalidatedSubmit = signal<boolean>(false)
  submitErrorMessage = signal<string>("")

  updateEmail(value: string) {
    this.email.set(value)
    this.invalidatedSubmit.set(false)
  }

  onClickOutside(event: Event) {
    if (event.target !== event.currentTarget) return
    this.modalService.close()
  }

  submit() {
    if (!this.email() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) {
      this.invalidatedSubmit.set(true)
      return
    }

    this.authService.sendResetPasswordEmail(this.email())
      .then(() => {
        this.modalService.openMessageModal("message.email-sent")
        this.modalService.close()
      })
      .catch(() => {
        this.submitErrorMessage.set(this.authService.errorMessage())
      })
  }

  openLogin() {
    this.modalService.open<AuthModalComponent>(AuthModalComponent, { isLogin: true })
  }
}
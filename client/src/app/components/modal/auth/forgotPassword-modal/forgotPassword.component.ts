import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../../services/ModalService';
import { AuthInputComponent } from "../auth-input/authInput.component";

@Component({
  selector: 'forgot-password-modal',
  imports: [AuthInputComponent],
  templateUrl: './forgotPassword.component.html',
  styleUrl: './forgotPassword.component.scss'
})
export class ForgotPasswordModalComponent {
  modalService = inject(ModalService)
  email = signal<string>("")
  invalidatedSubmit = signal<boolean>(false)

  updateEmail(value: string) {
    this.email.set(value)
    this.invalidatedSubmit.set(false)
  }
}
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ModalService } from '../../../../services/ModalService';
import { ForgotPasswordModalComponent } from '../forgotPassword-modal/forgotPassword.component';

@Component({
  selector: 'auth-input',
  imports: [],
  templateUrl: './authInput.component.html',
  styleUrl: './authInput.component.scss'
})
export class AuthInputComponent {
    modalService = inject(ModalService)
    name = input.required<string>()
    wasInvalidated = input.required<boolean>()
    passwordData = input<{isLogin: boolean, validationMessage: string} | null>(null)
    forgotPassword = output()
    valueOutput = output<string>()
    value = signal<string>("")

    updateValue(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value.set(value)
        this.valueOutput.emit(value)
    }

    forgotPasswordClicked() {
        this.forgotPassword.emit()
    }
}
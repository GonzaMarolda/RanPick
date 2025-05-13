import { Component, computed, inject, input, signal } from '@angular/core';
import { ModalService } from '../../../../services/ModalService';
import { AuthService } from '../../../../services/AuthService';
import { AuthInputComponent } from "../auth-input/authInput.component";
import { ForgotPasswordModalComponent } from '../forgotPassword-modal/forgotPassword.component';

@Component({
  selector: 'auth-modal',
  imports: [AuthInputComponent],
  templateUrl: './authModal.component.html',
  styleUrl: './authModal.component.scss'
})
export class AuthModalComponent {
  authService = inject(AuthService)
  modalService = inject(ModalService)
  isLogin = input.required<boolean>()
  isLoading = signal<boolean>(false)
  submitErrorMessage = signal<string>("")
  formData = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  invalidatedSubmit = signal({
    firstName: false,
    lastName: false,
    email: false,
    password: false
  })
  passwordValidationMessage = computed(() => {
    const password = this.formData().password;

    // Default
    if (password.length === 0) return ""

    // No whitespace
    if (/\s/.test(password)) return "Cannot contain spaces";

    // Length
    if (password.length < 8) return "Must be at least 8 characters"
    
      // Contains uppercase
    if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter";

    // Contains lowercase
    if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter";

    // Contains number
    if (!/[0-9]/.test(password)) return "Must contain at least one number";

    else return ""
  })

  onClickOutside(event: Event) {
    if (event.target !== event.currentTarget) return
    this.modalService.close()
  }

  switchAuthMode() {
    this.modalService.open<AuthModalComponent>(AuthModalComponent, { isLogin: !this.isLogin() })
  }

  openForgotPassword() {
    this.modalService.open<ForgotPasswordModalComponent>(ForgotPasswordModalComponent)
  }

  submit() {
    if (!this.isSubmitValid()) return
    this.isLoading.set(true)
    if (this.isLogin()) {
      this.authService.login(this.formData().email, this.formData().password)
        .then()
        .catch(() => {
          this.isLoading.set(false)
          this.submitErrorMessage.set(this.authService.errorMessage())
        })
    } else {
      this.authService.signup(this.formData())
        .then()
        .catch(() => {
          this.isLoading.set(false)
          this.submitErrorMessage.set(this.authService.errorMessage())
        })
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle(this.isLoading.set)
  }

  updateValue(type: string, value: string) {
    this.formData.update(data => ({ ...data, [type]: value }))
    this.invalidatedSubmit.update(data => ({ ...data, [type]: false }))
  }

  isSubmitValid() {
    const formData = this.formData()
    if (this.isLogin()) {
      let failed = false
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        this.invalidatedSubmit.update(prev => ({...prev, email: true}))
        failed = true
      }
      if (!formData.password) {
        this.invalidatedSubmit.update(prev => ({...prev, password: true}))
        failed = true
      }
      if (failed) return false
    } else {
      let failed = false
      if (formData.firstName.length < 3 || /[0-9]/.test(formData.firstName)) {
        this.invalidatedSubmit.update(prev => ({...prev, firstName: true}))
        failed = true
      }
      if (formData.lastName.length < 3 || /[0-9]/.test(formData.lastName)) {
        this.invalidatedSubmit.update(prev => ({...prev, lastName: true}))
        failed = true
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        this.invalidatedSubmit.update(prev => ({...prev, email: true}))
        failed = true
      }
      if (!formData.password || this.passwordValidationMessage() !== "") {
        this.invalidatedSubmit.update(prev => ({...prev, password: true}))
        failed = true
      }
      if (failed) return false
    }

    return true
  }
}

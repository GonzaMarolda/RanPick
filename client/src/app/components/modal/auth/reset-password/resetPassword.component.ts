import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../../services/ModalService';
import { AuthInputComponent } from "../auth-input/authInput.component";
import { ActivatedRoute } from '@angular/router';
import { AuthModalComponent } from '../auth-modal/authModal.component';
import { AuthService } from '../../../../services/AuthService';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'forgot-password-modal',
  imports: [AuthInputComponent, TranslateModule],
  templateUrl: './resetPassword.component.html',
  styleUrl: './resetPassword.component.scss'
})
export class ResetPasswordModalComponent {
	route = inject(ActivatedRoute)
	router = inject(Router)
	translate = inject(TranslateService)
	authService = inject(AuthService)
	modalService = inject(ModalService)
	password = signal<string>("")
	invalidatedSubmit = signal<boolean>(false)
	submitErrorMessage = signal<string>("")
	token = signal<string>("")
	passwordValidationMessage = computed(() => {
		const password = this.password();

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

	ngOnInit() {
		const queryToken = this.route.snapshot.queryParamMap.get('token')
		if (!queryToken) window.location.href = '/';

    this.token.set(queryToken!)
  }

  updatePassword(value: string) {
    this.password.set(value)
    this.invalidatedSubmit.set(false)
  }

  submit() {
    if (!this.password() || this.passwordValidationMessage() !== "") {
      this.invalidatedSubmit.set(true)
      return
    }

		this.authService.setNewPassword(this.token(), this.password())
      .then(() => {
				this.modalService.openMessageModal("Your password was updated.\nYou can now log in.")
        this.router.navigate(["/"])
      })
      .catch(() => {
        this.submitErrorMessage.set(this.authService.errorMessage())
      })
  }

  openLogin() {
    this.modalService.open<AuthModalComponent>(AuthModalComponent, { isLogin: true })
  }
}
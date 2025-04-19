import { Component, inject, signal, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../../../directives/ClickOutsideDirective';
import { ModalService } from '../../../services/ModalService';
import { WheelService } from '../../../services/WheelService';
import { Wheel } from '../../../models/wheel';
import { AuthService } from '../../../services/AuthService';

@Component({
  selector: 'open-modal',
  imports: [ClickOutsideDirective],
  templateUrl: './openModal.component.html',
  styleUrl: './openModal.component.scss'
})
export class OpenModalComponent implements OnInit {
  authService = inject(AuthService)
  wheelService = inject(WheelService)
  modalService = inject(ModalService)
  deleteConfirmationOpen = signal<boolean>(false)
  selectedWheel = signal<Wheel | null>(null)
  wheels = signal<Wheel[] | null>(null)

  ngOnInit() {
    this.wheelService.getWheels(this.authService.user()!.id)
      .then(wheels => {
        this.wheels.set(wheels)
      })
      .catch(() => {
        console.error("Error getting user's wheels: " + this.wheelService.errorMessage())
      })
  }

  switchDeleteConfirmationOpen() {
    this.deleteConfirmationOpen.update(prev => !prev)
  }

  closeModal() {
    if (this.deleteConfirmationOpen()) return

    this.modalService.close()
  }

  deleteSelectedWheel() {

  }
}
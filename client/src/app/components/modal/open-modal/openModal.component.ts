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
  selectedWheelId = signal<string>("")
  wheels = signal<Wheel[] | null>(null)

  ngOnInit() {
    this.wheelService.getWheels()
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

  openWheel(wheelId: string) {
    this.wheelService.getWheel(wheelId).then(() => {
      this.closeModal()
    })
  }

  openDeleteConfirmation(wheelId: string) {
    this.switchDeleteConfirmationOpen()
    this.selectedWheelId.set(wheelId)
  }

  deleteSelectedWheel() {
    this.wheelService.deleteWheel(this.selectedWheelId())
      .then(() => {
        this.wheels.update(prev => prev!.filter(wheel => wheel.id !== this.selectedWheelId()))
        this.modalService.openMessageModal("The wheel has been deleted successfully")
        this.selectedWheelId.set("")
      })
      .finally(() =>
        this.switchDeleteConfirmationOpen()
      )
  }
}
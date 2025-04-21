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
  selectedWheelId = signal<string>("")
  wheels = signal<Wheel[] | null>(null)
  confirmation = signal<{
    name: string,
    nameColor: string,
    headerText: string,
    bodyText: string,
    confirmFunc: () => void
  } | null>(null)
  createConfirmation = signal({
    name: "Create",
    nameColor: "var(--color-create)",
    headerText: "a new wheel?",
    bodyText: "Are you sure you want to create a new wheel? \n Any unsaved changes will be lost.",
    confirmFunc: this.createNewWheel.bind(this)
  })
  deleteConfirmation = signal({
    name: "Delete",
    nameColor: "var(--color-delete)",
    headerText: '"' + '?' + '"',
    bodyText: "Are you sure you want to delete this wheel? \n This action cannot be undone.",
    confirmFunc: this.deleteSelectedWheel.bind(this)
  })

  ngOnInit() {
    this.wheelService.getWheels()
      .then(wheels => {
        this.wheels.set(wheels)
      })
      .catch(() => {
        console.error("Error getting user's wheels: " + this.wheelService.errorMessage())
      })
  }

  closeModal() {
    if (this.confirmation()) return

    this.modalService.close()
  }

  openWheel(wheelId: string) {
    this.wheelService.getWheel(wheelId).then(() => {
      this.closeModal()
    })
  }

  closeConfirmation() {
    this.confirmation.set(null)
  }

  openDeleteConfirmation(wheelId: string, wheelName: string) {
    this.selectedWheelId.set(wheelId)
    this.deleteConfirmation.update(prev => ({...prev, headerText: '"' + wheelName + '"'}))
    this.confirmation.set(this.deleteConfirmation())
  }

  createNewWheel() {
    this.wheelService.createEmptyWheel()
    this.modalService.close()
  }

  deleteSelectedWheel() {
    this.wheelService.deleteWheel(this.selectedWheelId())
      .then(() => {
        this.wheels.update(prev => prev!.filter(wheel => wheel.id !== this.selectedWheelId()))
        this.modalService.openMessageModal("The wheel has been deleted successfully")
        this.selectedWheelId.set("")
        this.deleteConfirmation.update(prev => ({...prev, headerText: '"' + "?" + '"'}))
      })
      .finally(() =>
        this.closeConfirmation()
      )
  }
}
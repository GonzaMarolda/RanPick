import { Component, inject, signal, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../../../directives/ClickOutsideDirective';
import { ModalService } from '../../../services/ModalService';
import { WheelService } from '../../../services/WheelService';
import { Wheel } from '../../../models/wheel';
import { AuthService } from '../../../services/AuthService';
import { ConfirmationModalComponent } from '../confirm-modal/confirmModal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'open-modal',
  imports: [ClickOutsideDirective, ConfirmationModalComponent, TranslateModule],
  templateUrl: './openModal.component.html',
  styleUrl: './openModal.component.scss'
})
export class OpenModalComponent implements OnInit {
  authService = inject(AuthService)
  wheelService = inject(WheelService)
  modalService = inject(ModalService)
  selectedWheelId = signal<string>("")
  wheels = signal<Wheel[] | null>(null)
  translation = inject(TranslateService)
  confirmation = signal<{
    nameId: string,
    nameColor: string,
    headerTextId: string,
    headerDynamicName: string,
    bodyTextId: string,
    bodyDynamicName: string,
    confirmFunc: () => void
  } | null>(null)
  createConfirmation = signal({
    nameId: "common-words.create",
    nameColor: "var(--color-create)",
    headerTextId: "confirm-modal.header-create-wheel",
    headerDynamicName: "",
    bodyTextId: "confirm-modal.body-create-wheel",
    bodyDynamicName: "",
    confirmFunc: this.createNewWheel.bind(this)
  })
  deleteConfirmation = signal({
    nameId: "common-words.delete",
    nameColor: "var(--color-delete)",
    headerTextId: "confirm-modal.header-delete-wheel",
    headerDynamicName: "?",
    bodyTextId: "confirm-modal.body-delete-wheel",
    bodyDynamicName: "?",
    confirmFunc: this.deleteSelectedWheel.bind(this)
  })

  ngOnInit() {
    this.wheelService.getWheels()
      .then(wheels => {
        const sortedWheels = [...wheels].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        this.wheels.set(sortedWheels)
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
    this.deleteConfirmation.update(prev => ({...prev, headerDynamicName: wheelName}))
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
        this.modalService.openMessageModal("message.wheel-deleted")
        this.selectedWheelId.set("")
        this.deleteConfirmation.update(prev => ({...prev, headerDynamicName: "?"}))
      })
      .finally(() =>
        this.closeConfirmation()
      )
  }
}
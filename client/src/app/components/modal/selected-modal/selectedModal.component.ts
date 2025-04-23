import { Component, computed, inject, input, signal } from '@angular/core';
import { ContrastHelperService } from '../../../services/ContrastHelperService';
import { SidebarVisibilityService } from '../../../services/SidebarVisibilityService';
import { EntryService } from '../../../services/EntryService';
import { ModalService } from '../../../services/ModalService';
import { Entry } from '../../../models/entry';

@Component({
  selector: 'selected-modal',
  imports: [],
  templateUrl: './selectedModal.component.html',
  styleUrl: './selectedModal.component.scss'
})
export class SelectedModalComponent {
  contrastHelperService = inject(ContrastHelperService)
  sidebarVisibilityService = inject(SidebarVisibilityService)
  modalService = inject(ModalService)
  entryService = inject(EntryService)
  selectedEntries = input.required<Entry[]>()
  selectedColor = input.required<string>()

  onClickOutside(event: Event) {
    if (event.target !== event.currentTarget) return
    this.modalService.close()
    this.sidebarVisibilityService.setIsOpen(true)
  }

  close(event: Event) {
    this.modalService.close()
    this.sidebarVisibilityService.setIsOpen(true)
  }

  remove(event: Event) {
    this.entryService.removeEntry(this.selectedEntries()[this.selectedEntries().length - 1].id)
    this.close(event)
  }
}

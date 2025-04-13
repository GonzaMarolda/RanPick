import { Component, computed, inject, input, signal } from '@angular/core';
import { ContrastHelperService } from '../../services/ContrastHelperService';
import { SelectedModalService } from '../../services/SelectedModalService';
import { SidebarVisibilityService } from '../../services/SidebarVisibilityService';
import { EntryService } from '../../services/EntryService';

@Component({
  selector: 'selected-modal',
  imports: [],
  templateUrl: './selectedModal.component.html',
  styleUrl: './selectedModal.component.scss'
})
export class SelectedModalComponent {
  selectedModalService = inject(SelectedModalService)
  contrastHelperService = inject(ContrastHelperService)
  entryService = inject(EntryService)
  sidebarVisibilityService = inject(SidebarVisibilityService)

  onClickOutside(event: Event) {
    if (event.target !== event.currentTarget) return
    this.selectedModalService.isOpen.set(false)
    this.sidebarVisibilityService.setIsOpen(true)
  }

  close(event: Event) {
    this.selectedModalService.isOpen.set(false)
    this.sidebarVisibilityService.setIsOpen(true)
  }

  remove(event: Event) {
    this.entryService.removeEntry(this.selectedModalService.selected().id)
    this.close(event)
  }
}

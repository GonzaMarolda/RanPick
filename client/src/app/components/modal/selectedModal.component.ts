import { Component, computed, inject, input, signal } from '@angular/core';
import { ContrastHelperService } from '../../services/ContrastHelperService';
import { SelectedModalService } from '../../services/SelectedModalService';

@Component({
  selector: 'selected-modal',
  imports: [],
  templateUrl: './selectedModal.component.html',
  styleUrl: './selectedModal.component.scss'
})
export class SelectedModalComponent {
  selectedModalService = inject(SelectedModalService)
  contrastHelperService = inject(ContrastHelperService)

  onClickOutside(event: Event) {
    if (event.target !== event.currentTarget) return
    this.selectedModalService.isOpen.update(prev => false)
  }

  close(event: Event) {
    this.selectedModalService.isOpen.update(prev => false)
  }
}

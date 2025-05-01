import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ContrastHelperService } from '../../../services/ContrastHelperService';
import { HideableComponentsService } from '../../../services/HideableComponents';
import { EntryService } from '../../../services/EntryService';
import { ModalService } from '../../../services/ModalService';
import { Entry } from '../../../models/entry';
import { WheelService } from '../../../services/WheelService';

@Component({
  selector: 'selected-modal',
  imports: [],
  templateUrl: './selectedModal.component.html',
  styleUrl: './selectedModal.component.scss'
})
export class SelectedModalComponent implements OnInit {
  contrastHelperService = inject(ContrastHelperService)
  hideableComponentsService = inject(HideableComponentsService)
  modalService = inject(ModalService)
  entryService = inject(EntryService)
  wheelService = inject(WheelService)
  selectedEntries = input.required<Entry[]>()
  selectedColor = input.required<string>()

  ngOnInit(): void {
      this.wheelService.addSelectedRecord(this.selectedEntries())
  }

  onClickOutside(event: Event) {
    if (event.target !== event.currentTarget) return
    this.modalService.close()
    this.hideableComponentsService.setIsOpen(true)
  }

  close(event: Event) {
    this.modalService.close()
    this.hideableComponentsService.setIsOpen(true)
  }

  remove(event: Event) {
    this.entryService.removeEntry(this.selectedEntries()[this.selectedEntries().length - 1].id)
    this.close(event)
  }
}

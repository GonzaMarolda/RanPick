import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectedModalService {
  isOpen = signal<boolean>(false)
  selected = signal<string>('')
  selectedColor = signal<string>('')

  open(selected: string, selectedColor: string) {
    this.selected.update(prev => selected)
    this.selectedColor.update(prev => selectedColor)
    this.isOpen.update(prev => true)
  }
}
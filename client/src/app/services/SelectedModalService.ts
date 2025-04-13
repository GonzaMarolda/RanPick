import { Injectable, signal } from '@angular/core';
import { Entry } from '../models/entry';

@Injectable({ providedIn: 'root' })
export class SelectedModalService {
  isOpen = signal<boolean>(false)
  selected = signal<Entry>(new Entry(''))
  selectedColor = signal<string>('')

  open(selected: Entry, selectedColor: string) {
    this.selected.set(selected)
    this.selectedColor.set(selectedColor)
    this.isOpen.set(true)
  }
}
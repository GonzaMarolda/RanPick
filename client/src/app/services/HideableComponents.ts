import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HideableComponentsService {
  isOpen = signal<boolean>(true)

  setIsOpen(value: boolean) {
    this.isOpen.update(prev => value)
  }
}
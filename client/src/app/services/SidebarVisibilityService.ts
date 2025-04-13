import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarVisibilityService {
  isOpen = signal<boolean>(true)

  setIsOpen(value: boolean) {
    this.isOpen.update(prev => value)
  }
}
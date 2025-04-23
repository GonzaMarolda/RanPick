import { computed, inject, Injectable } from '@angular/core';
import { Entry } from '../models/entry';
import { WheelService } from './WheelService';

@Injectable({ providedIn: 'root' })
export class EntryService {
  wheelService = inject(WheelService)
  focusWheel = this.wheelService.focusWheel
  entries = computed(() => this.focusWheel().entries)

  getEntry(id: string) : Entry {
    return this.entries().find(e => e.id === id)!
  }

  createEmpty(): void {
    this.focusWheel.update(prev => ({...prev, entries: [...prev.entries, new Entry('', this.wheelService.focusWheel().id)]}));
  }

  removeEntry(id: string): void {
    this.focusWheel.update(prev => ({...prev, entries: prev.entries.filter(e => e.id !== id)}));
  }

  updateEntry(newEntry: Entry): void {
    this.focusWheel.update(prev => ({...prev, entries: prev.entries.map(e => e.id === newEntry.id ? newEntry : e)}));
  }

  getProbability(id: string) : string {
    const weight = this.getEntry(id).weight
    const totalWeight = this.entries().reduce((acc, e) => acc + e.weight, 0)
    return ((weight / totalWeight) * 100).toString().slice(0, 4)
  }
}
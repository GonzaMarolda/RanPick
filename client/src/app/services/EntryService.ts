import { Injectable, signal } from '@angular/core';
import { Entry } from '../models/entry';

@Injectable({ providedIn: 'root' })
export class EntryService {
  entries = signal<Array<Entry>>([]);

  getEntry(id: string) : Entry {
    return this.entries().find(e => e.id === id)!
  }

  createEmpty(): void {
    this.entries.update(current => [...current, new Entry('')]);
  }

  removeEntry(id: string): void {
    this.entries.update(current => current.filter(e => e.id !== id));
  }

  updateEntry(newEntry: Entry): void {
    this.entries.update(current => current.map(e => e.id === newEntry.id ? newEntry : e))
  }

  getProbability(id: string) : string {
    const weight = this.getEntry(id).weight
    const totalWeight = this.entries().reduce((acc, e) => acc + e.weight, 0)
    return ((weight / totalWeight) * 100).toString().slice(0, 4)
  }
}
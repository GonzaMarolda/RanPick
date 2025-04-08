import { Injectable, signal } from '@angular/core';
import { Entry } from '../models/entry';

@Injectable({ providedIn: 'root' })
export class EntryService {
  entries = signal<Array<Entry>>([]);

  createEmpty(): void {
    this.entries.update(current => [...current, new Entry('')]);
  }

  removeEntry(id: string): void {
    this.entries.update(current => current.filter(e => e.id !== id));
  }

  updateEntry(newEntry: Entry): void {
    this.entries.update(current => current.map(e => e.id === newEntry.id ? newEntry : e))
  }
}
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { EntryService } from '../../services/EntryService';
import { Entry } from '../../models/entry';

@Component({
    selector: 'entry',
    templateUrl: 'entry.component.html',
    styleUrl: 'entry.component.scss'
})
export class EntryComponent{
    entryService = inject(EntryService)
    entryData = input.required<Entry>()
    removeEntry = output<string>()
    updateEntry = output<Entry>()

    onRemove() {
        this.removeEntry.emit(this.entryData().id)
    }

    onNameInput(event: Event) {
        const newName = (event.target as HTMLInputElement).value
        const newEntry = {...this.entryData(), name: newName}
        this.updateEntry.emit(newEntry)
    }
}
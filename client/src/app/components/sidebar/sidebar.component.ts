import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { EntryComponent } from "../entry/entry.component";
import { Entry } from '../../models/entry';
import { EntryService } from '../../services/EntryService';

@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrl: 'sidebar.component.scss',
    imports: [EntryComponent],
})
export class Sidebar {
    entryService = inject(EntryService)
    
    addEntry() {
        this.entryService.createEmpty()
    }

    removeEntry(id: string) {
        this.entryService.removeEntry(id)
    }

    updateEntry(entry: Entry) {
        this.entryService.updateEntry(entry);
    }
}
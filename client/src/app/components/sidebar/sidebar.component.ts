import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { EntryComponent } from "../entry/entry.component";
import { Entry } from '../../models/entry';
import { EntryService } from '../../services/EntryService';
import { WheelService } from '../../services/WheelService';

@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrl: 'sidebar.component.scss',
    imports: [EntryComponent],
})
export class Sidebar {
    entryService = inject(EntryService)
    wheelService = inject(WheelService)
    
    addEntry() {
        this.entryService.createEmpty()
    }

    removeEntry(id: string) {
        this.entryService.removeEntry(id)
    }

    updateEntry(entry: Entry) {
        this.entryService.updateEntry(entry);
    }

    entries(): Entry[] {
        return this.wheelService.focusWheel().entries
    }

    isRootWheel(): boolean {
        return !this.wheelService.focusWheel().fatherWheelId
    }

    openPreviousWheel() {
        this.wheelService.openNestedWheel(this.wheelService.focusWheel().fatherWheelId!)
    }
}
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { EntryComponent } from "../entry/entry.component";
import { Entry } from '../../models/entry';
import { EntryService } from '../../services/EntryService';
import { WheelService } from '../../services/WheelService';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrl: 'sidebar.component.scss',
    imports: [EntryComponent, TranslateModule],
})
export class Sidebar {
    entryService = inject(EntryService)
    wheelService = inject(WheelService)
    translate = inject(TranslateService)
    
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

    hasEntries() : boolean {
        return this.entryService.entries().length > 0
    }
}
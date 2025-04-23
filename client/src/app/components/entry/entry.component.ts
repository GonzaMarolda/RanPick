import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { EntryService } from '../../services/EntryService';
import { Entry } from '../../models/entry';
import { PropertiesComponent } from '../properties/properties.component';
import { ClickOutsideDirective } from '../../directives/ClickOutsideDirective';
import { WheelService } from '../../services/WheelService';

@Component({
    selector: 'entry',
    templateUrl: 'entry.component.html',
    styleUrl: 'entry.component.scss',
    imports: [PropertiesComponent, ClickOutsideDirective]
})
export class EntryComponent{
    wheelService = inject(WheelService)
    entryService = inject(EntryService)
    entryId = input.required<string>()
    removeEntry = output<string>()
    updateEntry = output<Entry>()
    isPropertiesOpen = signal<boolean>(false)
    switchPropertiesTimeout = signal<any | null>(null)

    onRemove() {
        this.removeEntry.emit(this.entryData().id)
    }

    onNameInput(event: Event) {
        const newName = (event.target as HTMLInputElement).value
        const newEntry = {...this.entryData(), name: newName}
        this.updateEntry.emit(newEntry)
    }

    switchProperties(value?: boolean) {
        if (this.switchPropertiesTimeout()) return
        this.switchPropertiesTimeout.set(setTimeout(() => {
            this.isPropertiesOpen.update(prev => !prev)
            this.switchPropertiesTimeout.set(null)
        }, 100))
    }

    entryData() : Entry {
        return this.entryService.getEntry(this.entryId())
    }

    openNestedWheel() {
        const entry: Entry = this.entryData()
        if (entry.nestedWheel) {
            this.wheelService.openNestedWheel(entry.nestedWheel.id)
        } else {
            this.wheelService.createNestledWheel(entry)
        }
    }
}
import { Component, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { EntryService } from '../../services/EntryService';
import { Entry } from '../../models/entry';
import { PropertiesComponent } from '../properties/properties.component';
import { ClickOutsideDirective } from '../../directives/ClickOutsideDirective';
import { WheelService } from '../../services/WheelService';
import { ModalService } from '../../services/ModalService';
import { ConfirmationModalComponent } from '../modal/confirm-modal/confirmModal.component';

@Component({
    selector: 'entry',
    templateUrl: 'entry.component.html',
    styleUrl: 'entry.component.scss',
    imports: [PropertiesComponent, ClickOutsideDirective]
})
export class EntryComponent{
    modalService = inject(ModalService)
    wheelService = inject(WheelService)
    entryService = inject(EntryService)

    entryId = input.required<string>()
    removeEntry = output<string>()
    updateEntry = output<Entry>()
    isPropertiesOpen = signal<boolean>(false)
    switchPropertiesTimeout = signal<any | null>(null)

    onRemove() {
        const entry: Entry = this.entryData()
        if (entry.nestedWheel) {
            this.openConfirmation(false)
        } else {
            this.removeEntry.emit(this.entryData().id)
        }
    }

    onNameInput(event: Event) {
        const newName = (event.target as HTMLInputElement).value
        const newEntry = {...this.entryData(), name: newName}
        this.updateEntry.emit(newEntry)
    }

    switchProperties(value?: boolean) {
        console.log("AAAA")
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
            this.openConfirmation(true)
        }
    }

    openConfirmation(isCreate: boolean) {
        const confirmation = isCreate ?
            {
                name: "Create",
                nameColor: "var(--color-create)",
                headerText: "a nested wheel?",
                bodyText: 'Do you want to create a nested wheel for the entry "' + this.entryData().name + '"?',
                confirmFunc: (() => {
                    this.wheelService.createNestledWheel(this.entryData())
                    this.modalService.close()
                }).bind(this)
            } :
            {
                name: "Delete",
                nameColor: "var(--color-delete)",
                headerText: '"' + this.entryData().name + '"?',
                bodyText: "Are you sure you want to delete this entry? It has a wheel attached. \n This action cannot be undone.",
                confirmFunc: (() => {
                    this.wheelService.deleteNested(this.entryData().nestedWheel!.id)
                    this.removeEntry.emit(this.entryData().id)
                    this.modalService.close()
                }).bind(this)
            }

        this.modalService.open<ConfirmationModalComponent>(
            ConfirmationModalComponent, 
            { confirmation: confirmation }
        )
    }

    @ViewChild('entryElement') entryElement!: ElementRef;
    getPosition(): {top: number, left: number} {
        const rect = this.entryElement.nativeElement.getBoundingClientRect();
        return {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        }
    }
}
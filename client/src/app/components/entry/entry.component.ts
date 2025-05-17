import { Component, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { EntryService } from '../../services/EntryService';
import { Entry } from '../../models/entry';
import { PropertiesComponent } from '../properties/properties.component';
import { ClickOutsideDirective } from '../../directives/ClickOutsideDirective';
import { WheelService } from '../../services/WheelService';
import { ModalService } from '../../services/ModalService';
import { ConfirmationModalComponent } from '../modal/confirm-modal/confirmModal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'entry',
    templateUrl: 'entry.component.html',
    styleUrl: 'entry.component.scss',
    imports: [PropertiesComponent, TranslateModule]
})
export class EntryComponent{
    modalService = inject(ModalService)
    wheelService = inject(WheelService)
    entryService = inject(EntryService)
    translation = inject(TranslateService)
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
                nameId: "common-words.create",
                nameColor: "var(--color-create)",
                headerTextId: "confirm-modal.header-create-nested",
                headerDynamicName: "",
                bodyTextId: "confirm-modal.body-create-nested",
                bodyDynamicName: this.entryData().name,
                confirmFunc: (() => {
                    this.wheelService.createNestledWheel(this.entryData())
                    this.modalService.close()
                }).bind(this)
            } :
            {
                nameId: "common-words.delete",
                nameColor: "var(--color-delete)",
                headerTextId: "confirm-modal.header-delete-entry",
                headerDynamicName: this.entryData().name,
                bodyTextId: "confirm-modal.body-delete-entry",
                bodyDynamicName: "",
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
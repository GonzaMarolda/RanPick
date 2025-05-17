import { Component, ElementRef, HostListener, inject, input, output, signal, ViewChild } from '@angular/core';
import { EntryService } from '../../services/EntryService';
import { Entry } from '../../models/entry';
import { ColorSketchModule, SketchComponent } from 'ngx-color/sketch';
import { ColorEvent } from 'ngx-color';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'entry-properties',
    templateUrl: 'properties.component.html',
    styleUrl: 'properties.component.scss',
    imports: [ColorSketchModule, TranslateModule]
})
export class PropertiesComponent {
    entryService = inject(EntryService)
    elementRef = inject(ElementRef)
    translate = inject(TranslateService)
    entryId = input.required<string>()
    colorPickerVisible = signal<boolean>(false)
    switchColorTimeout = signal<any | null>(null)
    clickedOutside = output()
    entryPosition = input.required<{top: number, left: number}>()

    entry() : Entry {
        return this.entryService.getEntry(this.entryId())
    }

    updateWeight(event: Event) {
        const input = event.target as HTMLInputElement
        const value = input.value
        let fixedValue = value.replace(/\D/g, '').slice(0, 3)
        if (!fixedValue || fixedValue === "0") fixedValue = "1"
        input.value = fixedValue
        this.entryService.updateEntry({...this.entry(), weight: Number(fixedValue)}) 
    }

    updateWeightByButton(amount: number) {
        const newWeight = Math.min(999, Math.max(1, this.entry().weight + amount))
        this.entryService.updateEntry({...this.entry(), weight: newWeight}) 
    }

    updateColor(event: ColorEvent) {
        this.entryService.updateEntry({...this.entry(), color: event.color.hex}) 
    }

    toggleColorPickerVisible() {
        if (this.switchColorTimeout()) return
        this.switchColorTimeout.set(setTimeout(() => {
            this.colorPickerVisible.update(prev => !prev)
            this.switchColorTimeout.set(null)
        }, 100))
    }

    getEntryColor() {
        return this.entry().color ? this.entry().color : this.entry().defaultColor
    }

    @ViewChild(SketchComponent)
    colorPickerComponent?: SketchComponent;
    testSetColor(color: string) {
        this.entryService.updateEntry({...this.entry(), color: color})     
    }

    @ViewChild('mainContainer') mainContainer!: ElementRef<HTMLElement>;
    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.mainContainer.nativeElement.contains(target)) {
            this.clickedOutside.emit(); 
        }
    }
}
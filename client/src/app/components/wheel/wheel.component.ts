import { Component, computed, ElementRef, inject, effect, OnInit, signal, ViewChild, AfterViewInit, untracked } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EntryService } from '../../services/EntryService'
import { Entry } from '../../models/entry'
import { ContrastHelperService } from '../../services/ContrastHelperService'
import { HideableComponentsService } from '../../services/HideableComponents'
import { ModalService } from '../../services/ModalService'
import { SelectedModalComponent } from '../modal/selected-modal/selectedModal.component'
import { WheelService } from '../../services/WheelService'
import { Wheel } from '../../models/wheel'
import { SelectedHistoryComponent } from "../selected_history/selectedHistory.component";
import { SoundService } from '../../services/SoundService'

@Component({
    selector: 'wheel-screen',
    templateUrl: 'wheel.component.html',
    styleUrl: 'wheel.component.scss',
    animations: [
      trigger('appear', [
        state('small', 
          style({
            height: '0',
            width: '0',
            opacity: 0
          })),
        state('normal', 
          style({
            height: '*',
            width: '*',
            opacity: 1
          })),
        state('big', 
          style({
            height: '100vh',
            width: '100vw',
            opacity: 0
          })),
        transition('normal => big', animate('0.3s linear')),
        transition('small => normal', animate('0.4s ease-out'))
      ])
    ],
    imports: [SelectedHistoryComponent]
})
export class WheelScreen {
    entryService = inject(EntryService)
    contrastHelperService = inject(ContrastHelperService)
    hideableComponentsService = inject(HideableComponentsService)
    wheelService = inject(WheelService)
    modalService = inject(ModalService)
    soundService = inject(SoundService)
    @ViewChild('wheelGroup') wheelGroup!: ElementRef<SVGGElement>

    selected = signal<{name: string, id: string}>({name: 'Click the wheel to start', id: ""})
    spinClasses = { continuous: "spin-continuous", active: "spin" }
    spinClass = signal<String>(this.spinClasses.continuous)
    colors = ['#51CC0A', '#CC9D10', '#CC4021', '#9200CC', '#1DA0CC']
    editNameActive = signal<boolean>(false)
    tempEditedName = signal<string>("")

    initialRotation = signal("0deg")
    totalRotation = signal("0deg")
    nextNestedWheelId = signal<string | null>(null)
    finalSelectedEntries = signal<Entry[]>([])

    // Animations
    animationState = "normal"

    private intervalId: any;
    private updateInterval = 50; 
  
    constructor() {
      effect(() => {
        if (this.hideableComponentsService.isOpen() === false) return 

        this.initialRotation.set("0deg")
        this.spinClass.set(this.spinClasses.continuous)
        this.selected.set({name: 'Click the wheel to start', id: ""})
      })
    }

    segments = computed(() => {
      const entries = this.entryService.entries()
      const totalWeight = entries.reduce((acc, e) => acc + e.weight, 0)

      let startAngle = 0
      const unprocessedSegments = entries.map((entry, i) => {
        const angle = (entry.weight / totalWeight) * 360
        const segment = this.calculateSegment(entry, startAngle, angle, i)
        startAngle += angle
        return segment
      })
      const colorFixedSegments = unprocessedSegments.length > 1 ? unprocessedSegments.map((segment, index) => {
        const lastSegmentIndex = unprocessedSegments.length - 1
        if (index === lastSegmentIndex && 
            segment.color === unprocessedSegments[0].color &&
            unprocessedSegments[lastSegmentIndex - 1].color) {
              return {...segment, color: this.colors[1]}
        }  
        else return segment
      }) : unprocessedSegments
      return colorFixedSegments
    })

    updateEntryColor = effect(() => {
      const segments = this.segments()
      if (segments.length === 0) return 
      segments.forEach(segment => {
        const entry = this.entryService.getEntry(segment.id)
        if (entry.defaultColor === segment.color) return
        this.entryService.updateEntry({...entry, defaultColor: segment.color})
      })
    })
  
    private calculateSegment(entry: Entry, startAngle: number, angle: number, index: number) {
      const center = 60  
      const radius = 50
      
      // Degrees to Rad
      const start = (startAngle) * Math.PI / 180
      const end = (startAngle + angle) * Math.PI / 180
      
      // Arc initial and final coords
      const x1 = center + radius * Math.cos(start)
      const y1 = center + radius * Math.sin(start)
      const x2 = center + radius * Math.cos(end)
      const y2 = center + radius * Math.sin(end)
      
      const largeArc = angle > 180 ? 1 : 0
      const path = `M ${center},${center} L ${x1},${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2},${y2} Z`
      
      // Text positioning
      const middleAngle = startAngle + angle / 2
      const middleAngleRad = (middleAngle) * Math.PI / 180
      const textRadius = radius * 0.9
      const textX = center + textRadius * Math.cos(middleAngleRad)
      const textY = center + textRadius * Math.sin(middleAngleRad)

      const rotate = middleAngle

      // Adjust general font size on angle
      let fontSize = Math.min(15, Math.max(4, angle * 0.15))

      // Adjust font size on text width
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.textContent = entry.name
      svg.appendChild(text)
      document.body.appendChild(svg)

      text.setAttribute('font-size', fontSize + 'px')
      let textWidth = text.getComputedTextLength()
      if (textWidth >= radius * 0.65) {
        fontSize *= 0.65
        text.setAttribute('font-size', fontSize + 'px')
        textWidth = text.getComputedTextLength()
      }

      // Crop text if it's too big
      text.setAttribute('font-size', fontSize + 'px')
      textWidth = text.getComputedTextLength()
      let nameText = entry.name
      if (textWidth >= radius * 0.65) {
        const pxByChar = textWidth / entry.name.length
        const pxToRemove = (textWidth - radius * 0.65) / pxByChar
        nameText = entry.name.slice(0, entry.name.length - 1 - pxToRemove).concat('...')
      }
      svg.remove()

      // Adjust text color for contrast
      const color = entry.color ? entry.color : this.colors[index % this.colors.length]
      const textColor = this.contrastHelperService.getContrastTextColor(color)

      return {
        id: entry.id,
        path,
        name: nameText,
        color: color,
        textColor: textColor,
        textTransform: `translate(${textX},${textY}) rotate(${rotate})`,
        fontSize: fontSize,
        angle: angle,
      }
    }

    getCurrentRotation(): number {
      const group = this.wheelGroup.nativeElement
      const style = window.getComputedStyle(group)
      const transform = style.transform

      const values = transform.split('(')[1].split(')')[0].split(',');
      const a = parseFloat(values[0]);
      const b = parseFloat(values[1]);
    
      const angleRad = Math.atan2(b, a);
      const angleDeg = (angleRad * 180) / Math.PI;
    
      return(angleDeg + 360) % 360
    }

    startTrackRotation() {
      this.stopTrackRotation();
  
      this.intervalId = setInterval(() => {
        const currentAngle = this.getCurrentRotation();

        let foundIt = false
        let acumAngle = 0
        const reversedSegments = this.segments().slice().reverse()
        reversedSegments.forEach(segment => {
          if (foundIt) return

          acumAngle += segment.angle
          if (acumAngle >= currentAngle) {
            const selectedEntry = this.entryService.entries().find(e => e.id === segment.id)!

            if (selectedEntry.id !== this.selected()?.id) {
              this.selected.set({name: selectedEntry.name, id: selectedEntry.id})
              this.soundService.play("tick")
            }
            foundIt = true
          }
        });
        
      }, this.updateInterval);
    }

    stopTrackRotation() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }

    onSpin() {
      if (this.spinClass() == this.spinClasses.active) return
      this.finalSelectedEntries.set([])
      this.wheelService.setSpinnedWheel()

      this.spin()
    }

    spin() {
      const currentRotation = this.getCurrentRotation()
      this.initialRotation.set(currentRotation.toString() + "deg")
      this.totalRotation.set((10 * 360 + Math.random() * 360).toString() + "deg")
      this.spinClass.set(this.spinClasses.active)
      this.startTrackRotation()
      this.hideableComponentsService.setIsOpen(false)
    }

    spinAnimationFinished() {
      this.stopTrackRotation();
      const selectedEntry = this.entryService.entries().find(e => e.id === this.selected().id)!
      this.finalSelectedEntries.update(prev => prev.concat(selectedEntry))

      if (selectedEntry.nestedWheel && selectedEntry.nestedWheel.entries.length >= 2) {
        this.switchToNestedWheel(selectedEntry)
      } else {
        this.initialRotation.set(this.getCurrentRotation().toString() + "deg")
        const selectedColor = this.segments().find(segment => segment.id === selectedEntry.id)!.color
        this.modalService.open<SelectedModalComponent>(SelectedModalComponent, { selectedEntries: this.finalSelectedEntries(), selectedColor: selectedColor })
      }
    }

    switchToNestedWheel(selectedEntry: Entry) {
        this.animationState = "big"
        this.soundService.play("enter_nested")
        this.nextNestedWheelId.set(selectedEntry.nestedWheel!.id)
    }

    nestAnimationFinished() {
      if (this.spinClass() === this.spinClasses.continuous) {
        return
      }
       
      if (this.animationState === "small") {
        
      } else if (this.animationState === "normal") {
        this.spinClass.set(this.spinClasses.continuous)
        setTimeout(() => {
          this.spin()
        }, 0);
      } else if (this.animationState === "big") {
        this.animationState = "small"
        this.wheelService.openNestedWheel(this.nextNestedWheelId()!)
        this.nextNestedWheelId.set(null)
        setTimeout(() => {
          this.animationState = "normal"
        }, 0);
      }
    }

    selectEntry(segment: any) {
      this.selected.set(segment.label)
    }

    getColor(entryId: string) {
      const entry = this.entryService.getEntry(entryId)
      return entry.color ? entry.color : entry.defaultColor
    }

    switchEditName() {
      if (this.editNameActive()) {
        this.wheelService.updateName(this.tempEditedName())
      } else {
        this.tempEditedName.set(this.wheelService.wheel().name)
      }
      this.editNameActive.update(prev => !prev)
    }

    updateTempName(event: Event) {
      const input = event.target as HTMLInputElement
      const value = input.value
      this.tempEditedName.set(value)
    }

    entries(): Entry[] {
      return this.wheelService.focusWheel().entries
    }

    wheel(): Wheel {
      return this.wheelService.focusWheel()
    }

    ngOnDestroy() {
      this.stopTrackRotation()
    }
}
import { Component, computed, ElementRef, inject, effect, OnInit, signal, ViewChild } from '@angular/core'
import { EntryService } from '../../services/EntryService'
import { Entry } from '../../models/entry'
import { ContrastHelperService } from '../../services/ContrastHelperService'
import { SelectedModalService } from '../../services/SelectedModalService'
import { SidebarVisibilityService } from '../../services/SidebarVisibilityService'

@Component({
    selector: 'wheel-screen',
    templateUrl: 'wheel.component.html',
    styleUrl: 'wheel.component.scss'
})
export class WheelScreen {
    entryService = inject(EntryService)
    selectedModalService = inject(SelectedModalService)
    contrastHelperService = inject(ContrastHelperService)
    sidebarVisibilityService = inject(SidebarVisibilityService)
    @ViewChild('wheelGroup') wheelGroup!: ElementRef<SVGGElement>

    selected = signal<{name: string, id: string}>({name: 'Click the wheel to start', id: ""})
    spinClasses = { continuous: "spin-continuous", active: "spin" }
    spinClass = signal<String>(this.spinClasses.continuous)
    colors = ['#51CC0A', '#CC9D10', '#CC4021', '#9200CC', '#1DA0CC']

    initialRotation = signal("0deg")
    totalRotation = signal("0deg")

    private intervalId: any;
    private updateInterval = 100; 
  
    constructor() {
      effect(() => {
        if (this.sidebarVisibilityService.isOpen() === false) return 

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
      const colorFixedSegments = unprocessedSegments.map((segment, index) => {
        const lastSegmentIndex = unprocessedSegments.length - 1
        if (index === lastSegmentIndex && 
            segment.color === unprocessedSegments[0].color &&
            unprocessedSegments[lastSegmentIndex - 1].color) {
            return {...segment, color: this.colors[1]}
        }  
        else return segment
      })
      return colorFixedSegments
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
      const color = this.colors[index % this.colors.length]
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

            this.selected.set({name: selectedEntry.name, id: selectedEntry.id})
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
      this.initialRotation.update (prev => this.getCurrentRotation().toString() + "deg")
      this.totalRotation.update(prev => (10 * 360 + Math.random() * 360).toString() + "deg")
      this.spinClass.update(prev => this.spinClasses.active)
      this.startTrackRotation()
      this.sidebarVisibilityService.setIsOpen(false)
    }

    animationFinished() {
      this.stopTrackRotation();
      this.initialRotation.update(prev => this.getCurrentRotation().toString() + "deg")
      const selectedEntry = this.entryService.entries().find(e => e.id === this.selected().id)!
      const selectedColor = this.segments().find(segment => segment.id === selectedEntry.id)!.color
      this.selectedModalService.open(selectedEntry, selectedColor)
    }

    selectEntry(segment: any) {
      this.selected.set(segment.label)
    }

    ngOnDestroy() {
      this.stopTrackRotation()
    }
}
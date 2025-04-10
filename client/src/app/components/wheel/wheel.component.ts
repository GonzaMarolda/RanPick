import { Component, computed, inject, input, OnInit, signal } from '@angular/core'
import { EntryService } from '../../services/EntryService'
import { Entry } from '../../models/entry'
import { ContrastHelperService } from '../../services/ContrastHelperService'

@Component({
    selector: 'wheel-screen',
    templateUrl: 'wheel.component.html',
    styleUrl: 'wheel.component.scss'
})
export class WheelScreen {
    entryService = inject(EntryService)
    contrastHelperService = inject(ContrastHelperService)
    selected = signal<string>('')
    colors = ['#3369E8', '#D50F25', '#EEB211', '#009925']
  
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
      const start = (startAngle - 90) * Math.PI / 180
      const end = (startAngle + angle - 90) * Math.PI / 180
      
      // Arc initial and final coords
      const x1 = center + radius * Math.cos(start)
      const y1 = center + radius * Math.sin(start)
      const x2 = center + radius * Math.cos(end)
      const y2 = center + radius * Math.sin(end)
      
      const largeArc = angle > 180 ? 1 : 0
      const path = `M ${center},${center} L ${x1},${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2},${y2} Z`
      
      // Text positioning
      const middleAngle = startAngle + angle / 2
      const middleAngleRad = (middleAngle - 90) * Math.PI / 180
      const textRadius = radius * 0.9
      const textX = center + textRadius * Math.cos(middleAngleRad)
      const textY = center + textRadius * Math.sin(middleAngleRad)

      const rotate = middleAngle + 270

      // Adjust general font size on angle
      let fontSize = Math.min(20, Math.max(2, angle * 0.1));

      // Adjust font size on text width
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.textContent = entry.name
      svg.appendChild(text)
      document.body.appendChild(svg)

      text.setAttribute('font-size', fontSize + 'px')
      let textWidth = text.getComputedTextLength()
      if (textWidth >= radius * 0.65) {
        fontSize *= 0.75
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
      svg.remove();

      // Adjust text color for contrast
      const color = this.colors[index % this.colors.length]
      const textColor = this.contrastHelperService.getContrastTextColor(color)

      return {
        path,
        name: nameText,
        color: color,
        textColor: textColor,
        textTransform: `translate(${textX},${textY}) rotate(${rotate})`,
        fontSize: fontSize,
      }
    }
  
    selectEntry(segment: any) {
      this.selected.set(segment.label)
    }
}
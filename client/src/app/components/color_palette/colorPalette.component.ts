import { Component, signal } from '@angular/core';

@Component({
    selector: 'color-palette',
    templateUrl: 'colorPalette.component.html',
    styleUrl: 'colorPalette.component.scss'
})
export class ColorPaletteComponent {
    palettes = [
        new ColorPalette(
            "Default",
            [
                '#51CC0A', 
                '#CC9D10', 
                '#CC4021', 
                '#9200CC', 
                '#1DA0CC'
            ]
        ),
        new ColorPalette(
            "Alt 1",
            [
                '#510C0A', 
                '#CC0D10', 
                '#CC0021', 
                '#92F0CC', 
                '#1D00CC'
            ]
        ),
        new ColorPalette(
            "Alt 2",
            [
                '#5FFC0A', 
                '#CFFD10', 
                '#CFF021', 
                '#9FF0CC', 
                '#1FF0CC'
            ]
        ),
    ]
    selectedPalette = signal<ColorPalette>(this.palettes[0])

    getSegmentPath(index: number) {
        const center = 60
        const radius = 50
        const angle = (1 / this.selectedPalette().colors.length) * 360
        const startAngle = angle * index

        const start = (startAngle) * Math.PI / 180
        const end = (startAngle + angle) * Math.PI / 180

        const x1 = center + radius * Math.cos(start)
        const y1 = center + radius * Math.sin(start)
        const x2 = center + radius * Math.cos(end)
        const y2 = center + radius * Math.sin(end)

        return `M ${center},${center} L ${x1},${y1} A ${radius} ${radius} 0 0 1 ${x2},${y2} Z`
    }
}

class ColorPalette {
    name: string
    colors: string[]

    constructor(name: string, colors: string[]) {
        this.name = name
        this.colors = colors
    }
}
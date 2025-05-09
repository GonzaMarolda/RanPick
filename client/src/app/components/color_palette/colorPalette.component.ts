import { Component, computed, inject, signal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WheelService } from '../../services/WheelService';
import { ColorPaletteService } from '../../services/ColorPaletteService';
import { ColorPalette } from '../../models/colorPalette';
import { HideableComponentsService } from '../../services/HideableComponents';

@Component({
    selector: 'color-palette',
    templateUrl: 'colorPalette.component.html',
    styleUrl: 'colorPalette.component.scss',
    animations: [
        trigger('switch', [
            state('normal', 
                style({
                    transform: "scale(1)"
                })),
            state('big', 
                style({
                    transform: "scale(1.05)"
                })),
            transition('normal => big', animate('0s linear')),
            transition('big => normal', animate('0.2s linear'))
        ]),
        trigger('switch-text', [
            state('normal', 
                style({
                    "font-size": "1rem"
                })),
            state('big', 
                style({
                    "font-size": "1.05rem"
                })),
            transition('normal => big', animate('0s linear')),
            transition('big => normal', animate('0.2s linear'))
        ])
    ]
})
export class ColorPaletteComponent {
    wheelService = inject(WheelService)
    hideableComponentService = inject(HideableComponentsService)
    colorPaletteService = inject(ColorPaletteService)
    selectedPalette = computed(() => {
        const focusWheel = this.wheelService.focusWheel()
        return focusWheel.colorPalette
    })
    animationState = "normal"

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

    switchAnimationFinished() {
        if (this.animationState === "normal") {

        } else if (this.animationState === "big") {
            this.animationState = "normal"
        }
    }

    switchPalette(toTheRight: boolean) {
        const side = toTheRight ? 1 : -1
        this.animationState = "big"

        const palettes = this.colorPaletteService.palettes()
        const index = this.selectedPalette().id
        let nextIndex = index + side
        if (nextIndex < 0) nextIndex = palettes.length - 1
        if (nextIndex >= palettes.length) nextIndex = 0
        console.log("nextIndex" + nextIndex)
        this.wheelService.setColorPalette(palettes[nextIndex])
    }

    getOffset() {
        if (!this.hideableComponentService.isOpen()) return '10rem'

        return '0'
    }
}
import { Component, inject, signal } from '@angular/core';
import { WheelService } from '../../services/WheelService';
import { SelectedRecord } from '../../models/selectedRecord';
import { ContrastHelperService } from '../../services/ContrastHelperService';
import { HideableComponentsService } from '../../services/HideableComponents';

@Component({
    selector: 'selected-history',
    templateUrl: 'selectedHistory.component.html',
    styleUrl: 'selectedHistory.component.scss'
})
export class SelectedHistoryComponent {
    wheelService = inject(WheelService)
    hideableComponentService = inject(HideableComponentsService)
    contrastHelperService = inject(ContrastHelperService)
    isOpen = signal<boolean>(false)

    getSelectedHistory() : SelectedRecord[] {
        const selectedHistory = this.wheelService.focusWheel().selectedHistory.slice()
        return selectedHistory.reverse()
    }

    getSeparatedWords(selected: string) : String[] {
        return selected.split("-")
    }

    switchOpen() {
        this.isOpen.update(prev => !prev)
    }

    getOffset() {
        if (!this.hideableComponentService.isOpen()) return '15rem'

        return this.isOpen() ? '0' : '8.48rem'
    }
}
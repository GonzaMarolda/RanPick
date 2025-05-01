import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar.component";
import { WheelScreen } from "../wheel/wheel.component";
import { HideableComponentsService } from '../../services/HideableComponents';

@Component({
    selector: 'app-body',
    templateUrl: 'body.component.html',
    styleUrl: 'body.component.scss',
    imports: [Sidebar, WheelScreen]
})
export class BodyComponent {
    hideableComponentsService = inject(HideableComponentsService)
}
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { SelectedModalComponent } from "./components/modal/selectedModal.component";
import { SelectedModalService } from './services/SelectedModalService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SelectedModalComponent],
  template: `
    <app-header/>
    @if (selectedModalService.isOpen()) {<selected-modal selected="Pizza" selectedColor="#fa1b5c"/>}
    <router-outlet />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  selectedModalService = inject(SelectedModalService)
}
